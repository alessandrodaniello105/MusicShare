const fs = require('fs');
const path = require('path');

const KOTLIN_FILES = [
  'MainActivity.kt',
  'MainApplication.kt',
  'MediaDetectionModule.kt',
  'MediaDetectionPackage.kt',
  'MusicShareNotificationListenerService.kt'
];

const BACKUP_DIR = path.join(__dirname, '../backup/kotlin');
const SOURCE_DIR = path.join(__dirname, '../android/app/src/main/java/com/musicshare/app');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Backup Kotlin files
function backupKotlinFiles() {
  console.log('Backing up Kotlin files...');
  KOTLIN_FILES.forEach(file => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`Backed up ${file}`);
    } else {
      console.warn(`Warning: ${file} not found in source directory`);
    }
  });
  console.log('Backup complete!');
}

// Restore Kotlin files
function restoreKotlinFiles() {
  console.log('Restoring Kotlin files...');
  KOTLIN_FILES.forEach(file => {
    const backupPath = path.join(BACKUP_DIR, file);
    const targetPath = path.join(SOURCE_DIR, file);
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, targetPath);
      console.log(`Restored ${file}`);
    } else {
      console.warn(`Warning: ${file} not found in backup directory`);
    }
  });
  console.log('Restore complete!');
}

// Handle command line arguments
const command = process.argv[2];
if (command === 'backup') {
  backupKotlinFiles();
} else if (command === 'restore') {
  restoreKotlinFiles();
} else {
  console.log('Usage: node backup-kotlin.js [backup|restore]');
} 