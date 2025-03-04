import * as fs from 'fs/promises';
import * as path from 'path';

interface BazelPackage {
    name: string;
    type: 'service' | 'library';
    path: string;
}

export async function scanBazelWorkspace(workspacePath: string): Promise<BazelPackage[]> {
    const packages: BazelPackage[] = [];
    
    async function scanDirectory(dirPath: string): Promise<void> {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        console.log(`Scanning ${dirPath}`);
        
        // Check for BUILD or BUILD.bazel file
        const hasBuildFile = entries.some(entry => 
            entry.isFile() && (entry.name === 'BUILD' || entry.name === 'BUILD.bazel')
        );
        
        if (hasBuildFile) {
            console.log(`Found BUILD file in ${dirPath}`);
            const buildContent = await fs.readFile(
                path.join(dirPath, entries.find(e => e.name === 'BUILD' || e.name === 'BUILD.bazel')!.name),
                'utf-8'
            );
            
            // Try to infer if a service or library based on the build file content
            if (buildContent.includes('go_binary') || buildContent.includes('java_binary') ||
            buildContent.includes('nodejs_binary') || buildContent.includes('container_image') || buildContent.includes('_binary')) { // TODO: Let's focus here to identify hueristics for your build files
                packages.push({
                    name: path.basename(dirPath),
                    type: 'service',
                    path: path.relative(workspacePath, dirPath)
                });
            } else if (buildContent.includes('go_library') || buildContent.includes('java_library') ||
            buildContent.includes('py_library') || buildContent.includes('_library')) {
                packages.push({
                    name: path.basename(dirPath),
                    type: 'library',
                    path: path.relative(workspacePath, dirPath)
                });
                
                // TODO: Would it be useful to collect generated files? Can construct software lineage - useful for deduping alerts, e.g. security alerts
            }
        }
        
        // Recursively scan subdirectories
        for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                await scanDirectory(path.join(dirPath, entry.name));
            }
        }
    }
    
    await scanDirectory(workspacePath);
    return packages;
} 