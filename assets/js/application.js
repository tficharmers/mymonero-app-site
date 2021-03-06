// Copyright (c) 2014-2019, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//
"use strict";
//
function newDownloadLink__mac(version)
{
	return "https://github.com/mymonero/mymonero-app-js/releases/download/v"+version+"/MyMonero-"+version+".dmg"
}
function newDownloadLink__win(version)
{
	return "https://github.com/mymonero/mymonero-app-js/releases/download/v"+version+"/MyMonero.Setup."+version+".exe"
}
function newDownloadLink__lin(version)
{
	return "https://github.com/mymonero/mymonero-app-js/releases/download/v"+version+"/MyMonero-"+version+"-x86_64.AppImage"
}
//
function getOS()
{
	const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
	const platform = window.navigator.platform;
	if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'Mac OS X', 'macOS'].indexOf(platform) !== -1) {
		return 'Mac OS';
	} else if (['iPhone', 'iPad', 'iPod', 'iOS'].indexOf(platform) !== -1 && !window.MSStream) {
		return 'iOS';
	} else if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1) {
		return 'Windows';
	} else if (/windows phone/i.test(userAgent)) { // Windows Phone must come first because its UA may also contain "Android"
		return 'Windows Phone';
	} else if (/Android/.test(userAgent) || /Android/.test(platform)) {
		return 'Android';
	} else if (/(Linux|Ubuntu|Debian|CentOS|Fedora|FreeBSD|Gentoo|Mint|Sailfish|Slackware|RedHat)/.test(userAgent)) {
		return 'Linux';
	}
	return 'Mac OS'; // fallback
}
function getQueryStringValue(key)
{  
	return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 


(function(){
//
document.addEventListener("DOMContentLoaded", function()
{
	const osName = getOS();
	var mm = mm || {};
	//
	var desktopVersionString = '1.1.3'
	var iosVersionString = '1.1.3'
	//
	var desktopGitHubUrl = 'https://github.com/mymonero/mymonero-app-js/releases'
	var iosAppAppleID = "1372508199"
	var iosAppStoreUrl = "https://itunes.apple.com/us/app/apple-store/id" + iosAppAppleID + "?mt=8"
	var releasesInfo = 
	{
		mac: {
			downloadUrl: newDownloadLink__mac(desktopVersionString),
			downloadTitleSuffix: ' (Mac)',
			githubUrl: desktopGitHubUrl,
			version: desktopVersionString
		},
		windows: {
			downloadUrl: newDownloadLink__win(desktopVersionString),
			downloadTitleSuffix: ' (Windows)',
			githubUrl: desktopGitHubUrl,
			version: desktopVersionString
		},
		linux: {
			downloadUrl: newDownloadLink__lin(desktopVersionString),
			downloadTitleSuffix: ' (Linux)',
			githubUrl: desktopGitHubUrl,
			version: desktopVersionString
		},
		ios: {
			downloadUrl: iosAppStoreUrl,
			downloadTitleSuffix: ' &rarr; App Store',
			githubUrl: 'https://github.com/mymonero/mymonero-app-ios',
			version: iosVersionString
		}
	}
	//
	// Initialiser
	//
	mm.initialiser = {
		uaParser: function() {
			var mainButtons = document.querySelector(".download-buttons")
			if (osName.match(/^Android$/)) {
				addSoonStatus(' for Android');
				var platform_releasesInfo = releasesInfo["ios"] // for now
				addTopButton_github(
					platform_releasesInfo.githubUrl,
					platform_releasesInfo.version
				)
				updateOsName(releasesInfo_key);
				return
			}

			var releasesInfo_key = null;
			if(osName.match(/^(Mac OS)$/)) {
				releasesInfo_key = 'mac'
			} else if(osName.match(/^(Windows)$/)) {
				releasesInfo_key = 'windows'
			} else if(osName.match(/^iOS$/)) {
				releasesInfo_key = "ios"
			} else if(osName.match(/^(Linux|Ubuntu|Debian|CentOS|Fedora|FreeBSD|Gentoo|Mint|Sailfish|Slackware|RedHat)$/)) {
				// TODO: this might be missing some --^
				releasesInfo_key = "linux"
			} else { // fall back to linux ... anything else like Amiga OS could be filtered
				releasesInfo_key = "linux"
			}
			//
			var platform_releasesInfo = releasesInfo[releasesInfo_key]
			addDownloadButtons(
				platform_releasesInfo.downloadUrl,
				platform_releasesInfo.githubUrl,
				platform_releasesInfo.version,
				platform_releasesInfo.downloadTitleSuffix // NOTE this may be undefined
			)
			updateOsName(releasesInfo_key);
			//
			function addDownloadButtons(
				downloadUrl,
				githubUrl,
				shortVersionString,
				downloadTitleSuffix_orUndef
			) {
				//
				// insert top buttons
				var downloadButton_title = "Download"
				if (typeof downloadTitleSuffix_orUndef !== 'undefined' && downloadTitleSuffix_orUndef) {
					downloadButton_title += downloadTitleSuffix_orUndef
				}
				var download_listIndexLayer = document.createElement('li')
				download_listIndexLayer.innerHTML = '<a href="'
						+ downloadUrl
						+'" class="button download-app">'
						+ '<span class="convert-emoji" aria-hidden="true">&#x1F447;</span>'
						+ '<span class="text"><b>' + downloadButton_title + '</b></span>'
					+'</a>';
				mainButtons.appendChild(download_listIndexLayer);
				//
				addTopButton_github(
					githubUrl,
					shortVersionString
				)
				//
				// insert bottom button
				var bottom_downloadButtonLayer; // not wrapped in an 'li'
				{
					var tmpContainer = document.createElement('div')
					tmpContainer.innerHTML = '<a href="' + downloadUrl +  '" class="button extra-button">'
							+ '<span class="text">' + downloadButton_title + '</span>'
						+ '</a>'
					bottom_downloadButtonLayer = tmpContainer.firstChild
				}
				var bottomDownloadContainer = document.querySelector('.bottom-download-container')
				bottomDownloadContainer.appendChild(bottom_downloadButtonLayer) // after the h2; not wrapped in 'li'
			}
			function addTopButton_github(githubUrl, shortVersionString)
			{
				var github_listIndexLayer = document.createElement('li')
				github_listIndexLayer.innerHTML = '<a href="' + githubUrl + '" class="button secondary">'
						+ '<span class="text">Version ' + shortVersionString + ' &rarr; GitHub</span>'
					+ '</a>';
				mainButtons.appendChild(github_listIndexLayer);
			}
			//
			function addSoonStatus(comingSoonSuffix_orUndefined) {
				var soon_listIndexLayer = document.createElement('li')
				soon_listIndexLayer.innerHTML = '<span class="soon">'
						+ '<span class="text">Coming soon&#x2122;'+ (comingSoonSuffix_orUndefined||"") + '</span>'
					+ '</span>';
				mainButtons.appendChild(soon_listIndexLayer);
			}
			//
			function updateOsName(releasesInfo_key) {
				const display_osName = releasesInfo_key == "mac" ? "macOS" : osName;
				document.querySelector(".os").innerHTML = 'for ' + display_osName;
			}

			setTimeout(function()
			{
				const open_support = getQueryStringValue("open_support")
				if (open_support == "1" || open_support == "true" || open_support) {
					window.Intercom('show')
				}
			}, 300)
		},
		//
		// replace unicode characters with emojione images unless OS is stated
		//
		emojione: function() {
			if(osName.match(/^((?!(Mac OS|iOS|Android)).)*$/)) {
				emojione.imagePathPNG = '//cdn.jsdelivr.net/emojione/assets/3.0/png/64/';
				var emojis = document.querySelectorAll('.convert-emoji');
				Array.prototype.forEach.call(emojis, function(el, i){
					var original = el.innerHTML,
							converted = emojione.toImage(original);
					el.outerHTML = converted;
				});
			}
		}
	};
	//
	// Call the functions
	//
	var mymonero = mm.initialiser;
	mymonero.uaParser();
	mymonero.emojione();
});
//
})();
