import { Command } from 'commander';
import { scanBazelWorkspace } from './scanner';
import { writePackages } from './package_writer';

const program = new Command();

program
.name('bazel-port-importer')
.description('Import Bazel monorepo structure to port.io')
.version('1.0.0')
.requiredOption('-p, --path <path>', 'Path to Bazel workspace root')
.action(async (options) => {
    try {
        console.log(`Scanning ${options.path}`);
        const packages = await scanBazelWorkspace(options.path);
        console.log(`Found ${packages.length} packages`);
        console.log(JSON.stringify(packages, null, 2));
        await writePackages(packages);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
});

program.parse(); 