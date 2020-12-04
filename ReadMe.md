# Profile Post-it  

Add a note to a person's Facebook profile page  



---  

# Build commands  

**npm install** - Get all requierd dependencies  

**npm run SetExtensionVersion -BuildNo={x}** - Sets the version number used in manifests\
**npm run CheckExtensionVersion** - Outputs the current version number

**gulp ChromeIconResize** - Resize extension icon for Chrome's requiered sizes\
**gulp ChromeManifest** - Created Chrome's manifest\
**gulp ChromeInsertNoteHtml** - Replace placeholder values is note html\
**gulp ChromeBuildJs** - Builds extension's code (Complie typescript, includes correct storeage libray)\
**gulp ChromeBuild** - Runs all Chrome's build tasks (Three above tasks)\
**gulp ChromePack** - Zip extension folder\
**gulp ChromeBuildAndPack** - Builds Chrome extension and zips it

**gulp FirefoxIconResize** - Resize extension icon for Firefox's requiered sizes\
**gulp FirefoxManifest** - Created Firefox's manifest\
**gulp FirefoxBuildJs** - Builds extension's code (Complie typescript, includes correct storeage libray)\
**gulp FirefoxBuild** - Runs all Firefox's build tasks (Three above tasks)\
**gulp FirefoxPack** - Zip extension folder\
**gulp FirefoxBuildAndPack** - Builds Firefox extension and zips it