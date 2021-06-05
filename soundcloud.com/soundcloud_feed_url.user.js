// ==UserScript==
// @name     Soundcloud Feed URL
// @version  1
// @grant    none
// @include  https://soundcloud.com/*
// ==/UserScript==

const addFeedUrlToUserInfo = userId => {
    const profileHeader = document.querySelector('.profileHeaderInfo__content');

    if (profileHeader) {
        const feedUrlElement = document.createElement('h4');
        feedUrlElement.classList.add(
            'profileHeaderInfo__additional',
            'g-type-shrinkwrap-block',
            'theme-dark',
            'g-type-shrinkwrap-large-secondary'
        );

        const feedUrl = document.createElement('a');
        feedUrl.setAttribute('href', `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`);
        feedUrl.innerHTML = 'Podcast Feed URL';

        feedUrlElement.appendChild(feedUrl);
        profileHeader.appendChild(feedUrlElement);
    }
};

const addFeedUrl = () => {
    const androidUrl = document.querySelector('meta[property="al:android:url"]');

    if (androidUrl) {
        const userId = androidUrl['content'].split(':')[2];

        if (userId) {
            addFeedUrlToUserInfo(userId);
        }
    }
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addFeedUrl();
    }
};
