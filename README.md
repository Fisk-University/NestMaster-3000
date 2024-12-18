# NestMaster 3000 🚀

The ultimate file organization system that turns chaos into perfectly nested order. Take control of your file hierarchies with our advanced AWS-powered sorting system.

## What is NestMaster 3000?
Think of it as your digital Marie Kondo - it takes your messy files (with their CSV manifests) and transforms them into beautifully organized folder structures. Perfect for managing large collections of files that need to be organized based on identifiers.

## Features 🌟
- Upload individual files or ZIP archives
- CSV-driven organization
- Automatic folder structuring
- Progress tracking
- Supports files up to:
  - 1GB for ZIP archives
  - 500MB for individual file uploads
- Direct-to-S3 secure uploads

## Prerequisites 🛠
- AWS Account
- Node.js 14+
- Basic understanding of AWS services
- Coffee (optional but recommended)

## Quick Start 🚦

### 1. AWS Setup

#### Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
```

#### Configure CORS
```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["PUT", "POST", "GET"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
```

#### Create Lambda Functions
You'll need two Lambda functions:
1. `generate-upload-urls` (URL Generator)
   - Memory: 128 MB
   - Timeout: 30 seconds
2. `process-files` (File Processor)
   - Memory: 2048 MB
   - Timeout: 15 minutes

### 2. Frontend Setup

```bash
git clone https://github.com/your-repo/nestmaster-3000
cd nestmaster-3000
npm install
```

Create `.env`:
```
VITE_API_URL_UPLOAD=your-upload-lambda-url
VITE_API_URL_PROCESS=your-process-lambda-url
```

## How to Use NestMaster 3000 🎯

### Preparing Your Files

#### CSV Format
Your CSV needs an "Identifier" column:
```csv
Identifier,Description,Location
001,Front View,Building A
001a,Side View,Building A
002,Main Entry,Building B
```

#### File Naming
Name your files to match the identifiers:
- `001.jpg` (main file)
- `001a.jpg` (variant)
- `001b.jpg` (another variant)

### Upload Methods

#### Method 1: Individual Upload
1. Drop your CSV first
2. Add corresponding images
3. Click "Process"

#### Method 2: ZIP Upload
1. Pack your CSV and images in a ZIP
2. Drop the ZIP file
3. Click "Process"

### Output Structure
```
organized_files_20241218.zip
├── cleaned.csv
├── 001/
│   ├── 001.jpg
│   ├── 001a.jpg
│   └── 001b.jpg
└── 002/
    └── 002.jpg
```

## Development Guide 🔧

### Local Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Deploy to AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

## Troubleshooting 🔍

### Common Issues

#### Upload Fails
- Check file sizes (1GB ZIP / 500MB individual limit)
- Verify file names match CSV identifiers
- Check "Identifier" column exists in CSV

#### Processing Error
- Verify CSV format
- Check AWS Lambda logs
- Confirm sufficient Lambda memory

### Error Messages
- `"File size exceeds limit"`: Reduce file size or split into multiple uploads
- `"No CSV found"`: Ensure CSV is included and properly formatted
- `"Invalid identifier"`: Check file naming matches CSV identifiers

## TODOs 📝

### Lambda Function Code Examples
1. Add sample code for both Lambda functions
   - URL Generator Lambda
   - File Processor Lambda
2. Add size limit configuration
3. Add file type validation
4. Add batch processing for large files
5. Add cleanup functions for temporary files

### File Structure Examples

#### Input Example 1: Individual Files
```
├── project_data.csv
├── doc_001.pdf
├── doc_001a.pdf
├── doc_002.pdf
└── doc_002a.pdf
```

#### Input Example: ZIP Archive
```
archive.zip
├── project_data.csv
├── doc_001.pdf
├── doc_001a.pdf
├── doc_002.pdf
└── doc_002a.pdf
```

#### Output Structure
```
organized_files_20241218_120530.zip
├── cleaned.csv
├── doc_001/
│   ├── doc_001.pdf
│   └── doc_001a.pdf
├── doc_002/
│   ├── doc_002.pdf 
│   └── doc_002a.pdf
```



## Contributing 🤝
1. Fork it
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -am 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Create Pull Request

## Support 💡
- GitHub Issues: [Report a bug](https://github.com/your-repo/nestmaster-3000/issues)
- Documentation: [Wiki](https://github.com/your-repo/nestmaster-3000/wiki)

## License
MIT License - See [LICENSE](LICENSE) file

---

Built with ❤️ by LaTaevia Berry and Fisk University