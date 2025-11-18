import subprocess
import os
import sys

def convert_mp4_to_m4a(input_file, output_file=None):
    """
    Convert MP4 video file to M4A audio file using ffmpeg.
    
    Args:
        input_file: Path to the input MP4 file
        output_file: Path to the output M4A file (optional)
    """
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        return False
    
    # Generate output filename if not provided
    if output_file is None:
        output_file = os.path.splitext(input_file)[0] + '.m4a'
    
    # ffmpeg command to extract audio
    command = [
        'ffmpeg',
        '-i', input_file,           # Input file
        '-vn',                       # Disable video
        '-acodec', 'copy',           # Copy audio codec (no re-encoding)
        '-y',                        # Overwrite output file if exists
        output_file
    ]
    
    try:
        print(f"Converting '{input_file}' to '{output_file}'...")
        
        # Run ffmpeg command
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode == 0:
            print(f"Successfully converted to '{output_file}'")
            return True
        else:
            print(f"Error during conversion: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("Error: ffmpeg not found. Please install ffmpeg first.")
        print("Install instructions:")
        print("  - Ubuntu/Debian: sudo apt-get install ffmpeg")
        print("  - macOS: brew install ffmpeg")
        print("  - Windows: Download from https://ffmpeg.org/download.html")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def batch_convert(input_folder, output_folder=None):
    """
    Convert all MP4 files in a folder to M4A.
    
    Args:
        input_folder: Path to folder containing MP4 files
        output_folder: Path to output folder (optional)
    """
    if output_folder and not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    mp4_files = [f for f in os.listdir(input_folder) if f.lower().endswith('.mp4')]
    
    if not mp4_files:
        print(f"No MP4 files found in '{input_folder}'")
        return
    
    print(f"Found {len(mp4_files)} MP4 file(s)")
    
    for mp4_file in mp4_files:
        input_path = os.path.join(input_folder, mp4_file)
        
        if output_folder:
            output_filename = os.path.splitext(mp4_file)[0] + '.m4a'
            output_path = os.path.join(output_folder, output_filename)
        else:
            output_path = None
        
        convert_mp4_to_m4a(input_path, output_path)
        print()

if __name__ == "__main__":
    # ========== CUSTOMIZE HERE ==========
    
    # Option 1: Convert a single file
    input_file = "recoed.mp4"  # Change this to your MP4 file path
    output_file = "audio.m4a"  # Change this to your desired output name (or set to None for auto-naming)
    
    convert_mp4_to_m4a(input_file, output_file)
    
    # Option 2: Batch convert all MP4s in a folder (uncomment to use)
    # input_folder = "videos/"  # Folder containing MP4 files
    # output_folder = "audio/"  # Output folder (or None to save in same folder)
    # batch_convert(input_folder, output_folder)
    
    # ====================================