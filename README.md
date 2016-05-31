Demo Project
------------

# Requirements
Create a system to create custom search filters against a database of call records.
- Ability to create/edit/delete searches
- Ability to see results in a grid
- Demonstrate validation
- Make sure the user interface behaves in a manner so that elements show/hide or are disabled if not available
- Handle errors with AJAX requests instead of throwing exceptions/hard errors
- ~~~Merge multiple searches~~~ I didn't get to this, but it'd be fairly straight forward to implement:
	- use CallFiltersViewModel.savedFilters to build a checkbox list
	- allow user to select checkboxes and click Actions > Merge
	- save a new record looping over the savedFilters using $.extend to smash them together (this could lead to conflicts though)

## Notes
- I created an Attribute on the Web API controller CallsController::GetCalls that will randomly throw errors to show the app presents errors to the end user in a nice manner. This sometimes causes errors to pop up on page load, but using the refresh grid icon or searching will reload the grid.
- This solution was coded in Visual Studio Express 2015 and ran in debug mode
- There is a database SQL file in the root /sql/CallLog.sql. It will create a database called CallLog with some sample data
- I used SQL Server 2014 Express as the database

# Issue Tracking
I will be using the Issues tracker to show progress and have something for my commits to go against. I am used to using FogBugz & JIRA so it feels wrong not to have something to put my commits against in case there are issues with the code. This way we can see what the requirement was, what the changes were and possibly where/when the problem happened.

# Skill Levels of tech used in this demo
- Twitter Bootstrap 7/10
- jQuery 9/10
- .NET MVC 7/10
- .NET Web API 6/10
- Entity Framework 7/10
- JavaScript (ECMAScript 5) 8/10
- HTML5 - 8/10 (I passed the HTML5/CSS3/JavasScript Microsoft Cert, but this platform is so massive it's hard to claim full proficiency)
- SQL Server 7/10 (I can write stored procedures and raw SQL as I've done that for 7 years now. I prefer ORM's for easy things now though)