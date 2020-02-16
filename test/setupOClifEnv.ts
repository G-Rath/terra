// by default oclif registers ts-node, which prevents jest-snapshot from writing inline snapshots
process.env.OCLIF_TS_NODE = '0';
