// VidDown App JavaScript

// Application data
const appData = {
  "platforms": [
    {"name": "YouTube", "icon": "🎥", "url": "youtube.com"},
    {"name": "Facebook", "icon": "📘", "url": "facebook.com"},
    {"name": "Instagram", "icon": "📷", "url": "instagram.com"},
    {"name": "TikTok", "icon": "🎵", "url": "tiktok.com"},
    {"name": "Twitter", "icon": "🐦", "url": "twitter.com"},
    {"name": "Dailymotion", "icon": "🎬", "url": "dailymotion.com"}
  ],
  "videoQualities": [
    {"quality": "144p", "size": "5 MB", "format": "MP4"},
    {"quality": "240p", "size": "8 MB", "format": "MP4"},
    {"quality": "360p", "size": "12 MB", "format": "MP4"},
    {"quality": "480p", "size": "18 MB", "format": "MP4"},
    {"quality": "720p", "size": "25 MB", "format": "MP4"},
    {"quality": "1080p", "size": "45 MB", "format": "MP4"},
    {"quality": "4K", "size": "120 MB", "format": "MP4"},
    {"quality": "Audio Only", "size": "3 MB", "format": "MP3"}
  ],
  "sampleVideos": [
    {
      "id": 1,
      "title": "Amazing Nature Documentary",
      "thumbnail": "https://via.placeholder.com/320x180/4CAF50/white?text=Nature+Doc",
      "duration": "10:45",
      "channel": "NatureHub",
      "views": "2.5M views",
      "url": "https://youtube.com/watch?v=sample1"
    },
    {
      "id": 2,
      "title": "Cooking Tutorial - Italian Pasta",
      "thumbnail": "https://via.placeholder.com/320x180/FF9800/white?text=Cooking+Tutorial",
      "duration": "8:32",
      "channel": "ChefMaster",
      "views": "1.8M views",
      "url": "https://youtube.com/watch?v=sample2"
    },
    {
      "id": 3,
      "title": "Tech Review: Latest Smartphone",
      "thumbnail": "https://via.placeholder.com/320x180/1976D2/white?text=Tech+Review",
      "duration": "15:20",
      "channel": "TechGuru",
      "views": "3.2M views",
      "url": "https://youtube.com/watch?v=sample3"
    }
  ],
  "ads": [
    {"type": "banner", "content": "Get 50% off on Premium Subscription!", "color": "#4CAF50"},
    {"type": "banner", "content": "Download Faster with VidDown Pro!", "color": "#FF9800"},
    {"type": "banner", "content": "Remove Ads - Upgrade Today!", "color": "#1976D2"}
  ],
  "premiumFeatures": [
    "Ad-free experience",
    "Unlimited downloads",
    "4K video support",
    "Batch download",
    "Priority download speed",
    "Cloud storage sync",
    "Advanced video converter",
    "Download scheduler"
  ]
};

// Application state
let currentVideo = null;
let selectedQuality = null;
let downloads = [];
let downloadInProgress = false;
let isPaused = false;
let adTimer = 5;
let settings = {
  defaultQuality: '720p',
  autoDownload: true,
  saveToGallery: true,
  showAds: true,
  notifications: false
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadSettings();
  loadDownloads();
  populatePlatforms();
  populatePremiumFeatures();
  showRandomAd();
});

// Initialize the application
function initializeApp() {
  console.log('VidDown App initialized');
  switchTab('home');
}

// Setup all event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // URL Input
  const urlInput = document.getElementById('url-input');
  const pasteBtn = document.getElementById('paste-btn');
  const downloadBtn = document.getElementById('download-btn');

  pasteBtn.addEventListener('click', pasteFromClipboard);
  downloadBtn.addEventListener('click', processVideoURL);
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processVideoURL();
    }
  });

  // Download controls
  const pauseBtn = document.getElementById('pause-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
  if (cancelBtn) cancelBtn.addEventListener('click', cancelDownload);

  // Settings
  setupSettingsListeners();

  // Search and sort in downloads
  const searchInput = document.getElementById('search-downloads');
  const sortSelect = document.getElementById('sort-downloads');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterDownloads);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', sortDownloads);
  }
}

// Tab switching functionality
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Add active class to nav button
  const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }

  // Load tab-specific content
  if (tabName === 'downloads') {
    renderDownloads();
  }
}

// Populate platforms grid
function populatePlatforms() {
  const platformsGrid = document.getElementById('platforms-grid');
  if (!platformsGrid) return;

  platformsGrid.innerHTML = '';
  
  appData.platforms.forEach(platform => {
    const platformCard = document.createElement('div');
    platformCard.className = 'platform-card';
    platformCard.innerHTML = `
      <div class="platform-icon">${platform.icon}</div>
      <div class="platform-name">${platform.name}</div>
    `;
    
    platformCard.addEventListener('click', () => {
      document.getElementById('url-input').placeholder = `Enter ${platform.name} video URL...`;
      document.getElementById('url-input').focus();
    });
    
    platformsGrid.appendChild(platformCard);
  });
}

// Paste from clipboard functionality
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('url-input').value = text;
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    const urlInput = document.getElementById('url-input');
    urlInput.focus();
    urlInput.select();
  }
}

// Process video URL
function processVideoURL() {
  const url = document.getElementById('url-input').value.trim();
  
  if (!url) {
    alert('कृपया video URL enter करें');
    return;
  }
  
  if (!isValidVideoURL(url)) {
    alert('Invalid video URL. कृपया valid URL enter करें');
    return;
  }

  showLoading();
  
  // Simulate API call delay
  setTimeout(() => {
    hideLoading();
    displayVideoInfo(url);
    showInterstitialAd();
  }, 2000);
}

// Validate video URL
function isValidVideoURL(url) {
  const validDomains = ['youtube.com', 'youtu.be', 'facebook.com', 'instagram.com', 
                       'tiktok.com', 'twitter.com', 'dailymotion.com'];
  
  try {
    const urlObj = new URL(url);
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

// Display video information
function displayVideoInfo(url) {
  // Get random sample video for demo
  currentVideo = appData.sampleVideos[Math.floor(Math.random() * appData.sampleVideos.length)];
  
  // Update video info section
  document.getElementById('video-thumbnail').src = currentVideo.thumbnail;
  document.getElementById('video-duration').textContent = currentVideo.duration;
  document.getElementById('video-title').textContent = currentVideo.title;
  document.getElementById('video-channel').textContent = currentVideo.channel;
  document.getElementById('video-views').textContent = currentVideo.views;
  
  // Show video info section
  document.getElementById('video-info-section').classList.remove('hidden');
  
  // Populate quality options
  populateQualityOptions();
}

// Populate quality options
function populateQualityOptions() {
  const qualityGrid = document.getElementById('quality-grid');
  if (!qualityGrid) return;

  qualityGrid.innerHTML = '';
  
  appData.videoQualities.forEach((quality, index) => {
    const qualityOption = document.createElement('div');
    qualityOption.className = 'quality-option';
    qualityOption.innerHTML = `
      <div class="quality-info">
        <span class="quality-label">${quality.quality}</span>
        <span class="quality-size">${quality.size}</span>
      </div>
      <span class="quality-format">${quality.format}</span>
    `;
    
    qualityOption.addEventListener('click', () => {
      selectQuality(qualityOption, quality, index);
    });
    
    // Auto-select default quality
    if (quality.quality === settings.defaultQuality) {
      selectQuality(qualityOption, quality, index);
    }
    
    qualityGrid.appendChild(qualityOption);
  });
}

// Select quality option
function selectQuality(element, quality, index) {
  // Remove previous selection
  document.querySelectorAll('.quality-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Add selection to clicked element
  element.classList.add('selected');
  selectedQuality = quality;
  
  // Auto-start download if enabled
  if (settings.autoDownload && currentVideo) {
    setTimeout(() => {
      startDownload();
    }, 500);
  }
}

// Start download process
function startDownload() {
  if (!currentVideo || !selectedQuality || downloadInProgress) {
    return;
  }
  
  downloadInProgress = true;
  isPaused = false;
  
  // Show download progress section
  const progressSection = document.getElementById('download-progress-section');
  progressSection.classList.remove('hidden');
  
  // Set download info
  const filename = `${currentVideo.title}.${selectedQuality.format.toLowerCase()}`;
  document.getElementById('download-filename').textContent = filename;
  document.getElementById('download-size').textContent = selectedQuality.size;
  
  // Simulate download progress
  simulateDownload();
}

// Simulate download progress
function simulateDownload() {
  let progress = 0;
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('download-progress');
  const speedText = document.getElementById('download-speed');
  
  const downloadInterval = setInterval(() => {
    if (isPaused) {
      return;
    }
    
    progress += Math.random() * 5 + 2; // Random progress increment
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(downloadInterval);
      completeDownload();
    }
    
    // Update UI
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    // Random speed simulation
    const speed = Math.floor(Math.random() * 800) + 200;
    speedText.textContent = `Speed: ${speed} KB/s`;
    
  }, 200);
}

// Complete download
function completeDownload() {
  downloadInProgress = false;
  
  // Create download record
  const download = {
    id: Date.now(),
    title: currentVideo.title,
    thumbnail: currentVideo.thumbnail,
    duration: currentVideo.duration,
    quality: selectedQuality.quality,
    format: selectedQuality.format,
    size: selectedQuality.size,
    downloadDate: new Date().toISOString(),
    channel: currentVideo.channel
  };
  
  // Add to downloads array
  downloads.unshift(download);
  saveDownloads();
  
  // Hide progress section
  document.getElementById('download-progress-section').classList.add('hidden');
  
  // Show success message
  alert(`Video successfully downloaded! ${selectedQuality.quality} ${selectedQuality.format}`);
  
  // Reset form
  resetVideoForm();
  
  // Update recent downloads preview
  updateRecentDownloads();
}

// Toggle pause/resume
function togglePause() {
  const pauseBtn = document.getElementById('pause-btn');
  
  if (isPaused) {
    isPaused = false;
    pauseBtn.textContent = 'Pause';
  } else {
    isPaused = true;
    pauseBtn.textContent = 'Resume';
  }
}

// Cancel download
function cancelDownload() {
  downloadInProgress = false;
  isPaused = false;
  
  // Hide progress section
  document.getElementById('download-progress-section').classList.add('hidden');
  
  alert('Download cancelled');
  resetVideoForm();
}

// Reset video form
function resetVideoForm() {
  document.getElementById('url-input').value = '';
  document.getElementById('video-info-section').classList.add('hidden');
  currentVideo = null;
  selectedQuality = null;
}

// Render downloads
function renderDownloads() {
  const downloadsGrid = document.getElementById('downloads-grid');
  const noDownloads = document.getElementById('no-downloads');
  
  if (downloads.length === 0) {
    downloadsGrid.style.display = 'none';
    noDownloads.classList.remove('hidden');
    return;
  }
  
  downloadsGrid.style.display = 'grid';
  noDownloads.classList.add('hidden');
  
  downloadsGrid.innerHTML = '';
  
  downloads.forEach(download => {
    const downloadCard = createDownloadCard(download);
    downloadsGrid.appendChild(downloadCard);
  });
}

// Create download card
function createDownloadCard(download) {
  const card = document.createElement('div');
  card.className = 'download-card';
  
  const downloadDate = new Date(download.downloadDate).toLocaleDateString('hi-IN');
  
  card.innerHTML = `
    <div class="download-thumbnail">
      <img src="${download.thumbnail}" alt="${download.title}">
      <button class="play-overlay" onclick="playVideo('${download.id}')">▶</button>
    </div>
    <div class="download-info">
      <div class="download-title">${download.title}</div>
      <div class="download-meta">
        <span>${download.quality} • ${download.format}</span>
        <span>${download.size}</span>
      </div>
      <div class="download-meta">
        <span>${download.channel}</span>
        <span>${downloadDate}</span>
      </div>
    </div>
    <div class="download-actions">
      <button class="action-btn" onclick="playVideo('${download.id}')">Play</button>
      <button class="action-btn" onclick="shareVideo('${download.id}')">Share</button>
      <button class="action-btn" onclick="deleteVideo('${download.id}')">Delete</button>
    </div>
  `;
  
  return card;
}

// Play video
function playVideo(downloadId) {
  const download = downloads.find(d => d.id == downloadId);
  if (!download) return;
  
  // Show video player modal
  const modal = document.getElementById('video-player-modal');
  const playerTitle = document.getElementById('player-title');
  const videoPlayer = document.getElementById('video-player');
  
  playerTitle.textContent = download.title;
  
  // Set video source (using placeholder for demo)
  videoPlayer.src = `https://sample-videos.com/zip/10/mp4/SampleVideo_${download.quality.replace('p', '')}.mp4`;
  
  modal.classList.remove('hidden');
}

// Close video player
function closeVideoPlayer() {
  const modal = document.getElementById('video-player-modal');
  const videoPlayer = document.getElementById('video-player');
  
  videoPlayer.pause();
  videoPlayer.src = '';
  modal.classList.add('hidden');
}

// Toggle fullscreen
function toggleFullscreen() {
  const videoPlayer = document.getElementById('video-player');
  
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoPlayer.requestFullscreen().catch(err => {
      console.log('Fullscreen error:', err);
    });
  }
}

// Share video
function shareVideo(downloadId) {
  const download = downloads.find(d => d.id == downloadId);
  if (!download) return;
  
  if (navigator.share) {
    navigator.share({
      title: download.title,
      text: `Check out this video: ${download.title}`,
      url: window.location.href
    });
  } else {
    // Fallback
    navigator.clipboard.writeText(`${download.title} - Downloaded from VidDown`);
    alert('Video info copied to clipboard!');
  }
}

// Delete video
function deleteVideo(downloadId) {
  if (confirm('क्या आप इस video को delete करना चाहते हैं?')) {
    downloads = downloads.filter(d => d.id != downloadId);
    saveDownloads();
    renderDownloads();
    updateRecentDownloads();
  }
}

// Filter downloads
function filterDownloads() {
  const query = document.getElementById('search-downloads').value.toLowerCase();
  const cards = document.querySelectorAll('.download-card');
  
  cards.forEach(card => {
    const title = card.querySelector('.download-title').textContent.toLowerCase();
    const channel = card.querySelector('.download-meta span').textContent.toLowerCase();
    
    if (title.includes(query) || channel.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Sort downloads
function sortDownloads() {
  const sortBy = document.getElementById('sort-downloads').value;
  
  downloads.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'size':
        return parseInt(b.size) - parseInt(a.size);
      case 'date':
      default:
        return new Date(b.downloadDate) - new Date(a.downloadDate);
    }
  });
  
  renderDownloads();
}

// Update recent downloads preview
function updateRecentDownloads() {
  const previewContainer = document.getElementById('downloads-preview');
  if (!previewContainer) return;
  
  previewContainer.innerHTML = '';
  
  const recentDownloads = downloads.slice(0, 5);
  
  recentDownloads.forEach(download => {
    const previewCard = document.createElement('div');
    previewCard.className = 'preview-card';
    previewCard.onclick = () => playVideo(download.id);
    
    previewCard.innerHTML = `
      <img src="${download.thumbnail}" alt="${download.title}" class="preview-thumbnail">
      <div class="preview-info">
        <div class="preview-title">${download.title.substring(0, 30)}${download.title.length > 30 ? '...' : ''}</div>
        <div class="preview-meta">${download.quality} • ${download.format}</div>
      </div>
    `;
    
    previewContainer.appendChild(previewCard);
  });
}

// Setup settings listeners
function setupSettingsListeners() {
  const settingsElements = {
    'default-quality': 'defaultQuality',
    'auto-download': 'autoDownload',
    'save-to-gallery': 'saveToGallery',
    'show-ads': 'showAds',
    'notifications': 'notifications'
  };
  
  Object.keys(settingsElements).forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    
    const settingKey = settingsElements[id];
    
    if (element.type === 'checkbox') {
      element.addEventListener('change', (e) => {
        settings[settingKey] = e.target.checked;
        saveSettings();
      });
    } else {
      element.addEventListener('change', (e) => {
        settings[settingKey] = e.target.value;
        saveSettings();
      });
    }
  });
}

// Load settings
function loadSettings() {
  // In a real app, this would load from localStorage
  const savedSettings = localStorage.getItem('viddown-settings');
  if (savedSettings) {
    settings = {...settings, ...JSON.parse(savedSettings)};
  }
  
  // Apply settings to UI
  Object.keys(settings).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = settings[key];
      } else {
        element.value = settings[key];
      }
    }
  });
}

// Save settings
function saveSettings() {
  localStorage.setItem('viddown-settings', JSON.stringify(settings));
}

// Load downloads from localStorage
function loadDownloads() {
  const savedDownloads = localStorage.getItem('viddown-downloads');
  if (savedDownloads) {
    downloads = JSON.parse(savedDownloads);
  }
  updateRecentDownloads();
}

// Save downloads to localStorage
function saveDownloads() {
  localStorage.setItem('viddown-downloads', JSON.stringify(downloads));
}

// Populate premium features
function populatePremiumFeatures() {
  const featuresGrid = document.getElementById('premium-features-grid');
  if (!featuresGrid) return;
  
  const icons = ['🚫', '⬇️', '🎬', '📦', '⚡', '☁️', '🔄', '📅'];
  
  appData.premiumFeatures.forEach((feature, index) => {
    const featureCard = document.createElement('div');
    featureCard.className = 'feature-card';
    featureCard.innerHTML = `
      <div class="feature-icon">${icons[index] || '✨'}</div>
      <div class="feature-text">${feature}</div>
    `;
    featuresGrid.appendChild(featureCard);
  });
  
  // Setup upgrade buttons
  document.querySelectorAll('.upgrade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Premium upgrade functionality coming soon! Contact support for early access.');
    });
  });
}

// Ad system
function showRandomAd() {
  if (!settings.showAds) return;
  
  const topAd = document.querySelector('.top-ad .ad-text');
  const bottomAd = document.querySelector('.bottom-ad .ad-text');
  
  const randomAd = appData.ads[Math.floor(Math.random() * appData.ads.length)];
  
  if (topAd) topAd.textContent = randomAd.content;
  if (bottomAd) {
    const otherAd = appData.ads.find(ad => ad !== randomAd);
    bottomAd.textContent = otherAd ? otherAd.content : randomAd.content;
  }
}

function closeAd(button) {
  button.parentElement.parentElement.style.display = 'none';
}

// Interstitial ad functionality
function showInterstitialAd() {
  if (!settings.showAds) return;
  
  const modal = document.getElementById('interstitial-ad-modal');
  const closeBtn = document.getElementById('ad-close-btn');
  const timerSpan = document.getElementById('ad-timer');
  
  adTimer = 5;
  closeBtn.disabled = true;
  modal.classList.remove('hidden');
  
  const countdown = setInterval(() => {
    adTimer--;
    timerSpan.textContent = adTimer;
    
    if (adTimer <= 0) {
      clearInterval(countdown);
      closeBtn.disabled = false;
      closeBtn.style.opacity = '1';
    }
  }, 1000);
}

function closeInterstitialAd() {
  document.getElementById('interstitial-ad-modal').classList.add('hidden');
}

function upgradeFromAd() {
  closeInterstitialAd();
  switchTab('premium');
}

function skipAd() {
  closeInterstitialAd();
}

// Loading overlay
function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// Utility functions
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'v':
        if (e.target.id === 'url-input') {
          e.preventDefault();
          pasteFromClipboard();
        }
        break;
      case 'Enter':
        if (e.target.id === 'url-input') {
          e.preventDefault();
          processVideoURL();
        }
        break;
    }
  }
  
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal:not(.hidden)');
    modals.forEach(modal => {
      if (modal.id === 'video-player-modal') {
        closeVideoPlayer();
      } else if (modal.id === 'interstitial-ad-modal') {
        if (!document.getElementById('ad-close-btn').disabled) {
          closeInterstitialAd();
        }
      }
    });
  }
});

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}