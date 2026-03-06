"""
Build script for OCSafe Agent .exe
Run this to create a single distributable executable.

Usage:
  cd c:\\OCPL\\agent
  python build.py
"""
import PyInstaller.__main__
import os

# Get the directory of this script
agent_dir = os.path.dirname(os.path.abspath(__file__))

PyInstaller.__main__.run([
    os.path.join(agent_dir, 'main.py'),
    '--onefile',                        # Single .exe file
    '--name', 'OCSafeAgent',            # Output name
    '--console',                        # Show console (for debugging; use --noconsole for silent)
    '--clean',                          # Clean build cache
    '--distpath', os.path.join(agent_dir, 'dist'),
    '--workpath', os.path.join(agent_dir, 'build'),
    '--specpath', agent_dir,
    # Hidden imports that PyInstaller might miss
    '--hidden-import', 'collectors',
    '--hidden-import', 'collectors.system',
    '--hidden-import', 'collectors.security',
    '--hidden-import', 'collectors.processes',
    '--hidden-import', 'collectors.network',
    '--hidden-import', 'config',
])

print("\n" + "=" * 50)
print("BUILD COMPLETE!")
print("=" * 50)
print(f"Executable: {os.path.join(agent_dir, 'dist', 'OCSafeAgent.exe')}")
print("\nTo run: .\\dist\\OCSafeAgent.exe")
print("To distribute: Copy OCSafeAgent.exe to target machines")
