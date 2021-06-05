# Scripts for soundcloud.com

## soundcloud_feed_url.user.js

Soundcloud has an RSS feed for every user that is not displayed in their UI. It always has the form
of https://feeds.soundcloud.com/users/soundcloud:users:123456789/sounds.rss

This script parsed the meta information in the page header to determine the user ID. Then it adds a link "Podcast Feed
Url" to the user information header.