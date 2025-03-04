import { upsertEntity } from './port_client';

interface BazelPackage {
  name: string;
  type: 'service' | 'library';
  path: string;
}

export async function writePackages(packages: BazelPackage[]): Promise<void> {
  for (const pkg of packages) {
    try {
      // Create or update entity in Port.io
      await upsertEntity('bazel_package', pkg.name, pkg.name, {
        type: pkg.type,
        path: pkg.path
      }, {});
      
      console.log(`Imported ${pkg.type} "${pkg.name}" successfully`);
    } catch (error) {
      console.error(`Failed to import ${pkg.name}:`, error.message);
    }
  }
} 