## NODE: YOUTUBE TITLE UPDATER TO MATCH VIEW COUNT

# Functionality
Node REST server/api is going to have a .get route that either queries the youtube api for the number of views on my video, or uses cheerio to track num views on other peoples videos. A cron job regularly calls to the REST api to get the current number of views, and then updates the youtube title with the new number of views.