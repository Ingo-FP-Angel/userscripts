# Scripts for tibrosBB

## add_regular_links_to_projects.user.js

Changes to the list of projects

* add a regular HTML link that opens in target "_blank" to each project in the search result list

Per default, the "Details" buttons used to open the project details are form submit buttons which cannot be opened in
the background. When returning from the details page to the search result list in the same tab, the search results are
gone as well as the filter criteria.

This script adds a regular link next to the existing button, so that the project details can be opened in a new tab, not
losing the search result that way.