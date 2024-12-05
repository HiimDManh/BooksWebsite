# Define variables
$projectPath = "D:\Full_Stack_Dev\Books\BooksWebsite\BooksWebsite.csproj"  # Replace with the path to your .csproj file
$outputDir = "./output"

# Run the dotnet publish command
dotnet publish $projectPath -c Release -o $outputDir

Write-Host "Build completed. Output is in $outputDir"
