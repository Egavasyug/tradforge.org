import fs from 'fs';
import path from 'path';
import solc from 'solc';

const ROOT = process.cwd();
const MAIN = path.join(ROOT, 'CammunityDAO.sol');
const ADDRESS = '0xa5A750f3eF47fc35e5c1Af2c54C1182Abb392125';
const RPC = 'https://mainnet.base.org';

function read(p) { return fs.readFileSync(p, 'utf8'); }

function resolveImport(importPath, fromFile) {
  if (importPath.startsWith('@openzeppelin/')) {
    const p = path.join(ROOT, 'node_modules', importPath);
    return fs.readFileSync(p, 'utf8');
  }
  const base = path.dirname(fromFile);
  const p = path.resolve(base, importPath);
  return fs.readFileSync(p, 'utf8');
}

function stripPragmaAndSpdx(src) {
  return src.split('\n').filter(l => !/^\s*pragma\s+solidity/.test(l) && !/^\s*\/\/\s*SPDX-License-Identifier:/.test(l)).join('\n');
}

function inlineImports(src, fromFile) {
  const importRegex = /import\s+(?:"([^"]+)"|\{[^}]+\}\s+from\s+"([^"]+)");/g;
  return src.replace(importRegex, (_, a, b) => {
    const imp = a || b;
    const content = resolveImport(imp, fromFile);
    return stripPragmaAndSpdx(inlineImports(content, path.resolve(path.dirname(fromFile), imp)));
  });
}

function extractContractBlock(src, contractName) {
  const startIdx = src.indexOf(`contract ${contractName}`);
  if (startIdx === -1) return src; // fallback
  const pre = src.slice(0, startIdx);
  let i = src.indexOf('{', startIdx);
  let depth = 0; let end = i;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  const block = src.slice(startIdx, end);
  return pre + block + '\n';
}

function buildFlattened(contractName = 'ModifiedCammunityDAO') {
  let src = read(MAIN);
  // Inline imports
  src = inlineImports(src, MAIN);
  // Keep license + pragma from main file only
  const pragmaLine = (read(MAIN).split('\n').find(l => /pragma\s+solidity/.test(l)) || 'pragma solidity ^0.8.0;');
  const spdxLine = (read(MAIN).split('\n').find(l => /SPDX-License-Identifier/.test(l)) || '// SPDX-License-Identifier: MIT');
  src = `${spdxLine}\n${pragmaLine}\n` + stripPragmaAndSpdx(src);
  // Remove any content after the specified contract block
  src = extractContractBlock(src, contractName);
  return src;
}

function stdInput(flattened, optimizer = true) {
  return {
    language: 'Solidity',
    sources: { 'Flattened.sol': { content: flattened } },
    settings: {
      optimizer: { enabled: optimizer, runs: 200 },
      outputSelection: { '*': { '*': ['evm.deployedBytecode.object', 'abi'] } },
    },
  };
}

function stripMetadataHex(hex) {
  if (!hex || hex === '0x') return hex;
  const h = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (h.length < 4) return hex;
  const last4 = h.slice(-4);
  const metaLen = parseInt(last4, 16);
  const total = metaLen * 2 + 4;
  if (total > h.length) return '0x' + h; // fallback
  return '0x' + h.slice(0, h.length - total);
}

async function fetchOnchainBytecode(address) {
  const res = await fetch(RPC, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getCode', params: [address, 'latest'], id: 1 })
  });
  const j = await res.json();
  if (!j.result) throw new Error('No bytecode from RPC');
  return j.result.toLowerCase();
}

async function main() {
  const flattened = buildFlattened();
  const installedVersion = solc.version();
  const versionsToTry = [installedVersion];
  const onchain = await fetchOnchainBytecode(ADDRESS);
  const onchainStripped = stripMetadataHex(onchain);

  let matched = null;
  for (const v of versionsToTry) {
    const input = stdInput(flattened, true);
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    if (output.errors) {
      const fatal = output.errors.filter(e => e.severity === 'error');
      if (fatal.length) {
        console.error('Compile errors:', fatal.map(e => e.formattedMessage).join('\n'));
        continue;
      }
    }
    const contracts = output.contracts['Flattened.sol'] || {};
    const names = Object.keys(contracts);
    const target = names.find(n => /ModifiedCammunityDAO/.test(n)) || names[0];
    const bytecode = contracts[target]?.evm?.deployedBytecode?.object;
    if (!bytecode) { console.error('No bytecode for', target); continue; }
    const localStripped = stripMetadataHex('0x' + bytecode.toLowerCase());
    if (localStripped === onchainStripped) {
      matched = { version: v, optimizer: true, target, bytecodeLen: bytecode.length/2 };
      break;
    }
  }

  if (matched) {
    console.log('MATCH: yes');
    console.log('compiler:', matched.version, 'optimizer:', matched.optimizer, 'contract:', matched.target, 'len:', matched.bytecodeLen);
    process.exit(0);
  } else {
    console.log('MATCH: no');
    console.log('Tried compiler:', versionsToTry.join(','));
    // emit hints
    console.log('On-chain (stripped) length:', (onchainStripped.length-2)/2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

