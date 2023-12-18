# DndInventory

## A complete character sheet and inventory tracker for DnD or any other game that can be expressed as a ruleset.

This came to be because I tried to find an online character sheet for 5E that I could use for the game I was participating in.

I quickly found that any that I could find just didn't work the way I wanted to. Mainly I needed a nice way to track
multiple characters with different abilities easily.

I also found one that was so complicated that to create a character I ended up going through way too many steps and
having no idea what I was doing in the slightest. It seemed very powerful, with the ability to add fields and stuff.
But there was no apparent way to "just get going". I just wanted to create a character, fill in my stats and go.
I didn't want to spend an hour trying to figure out how to add a class.

So with these things in mind I set out to create my own thing. As you do.

Well, this really started when I found a video by Zee Bashew titled `Encumbrance in 5E Dnd`. In the video Zee talks about
an alternate way of tracking encumbrance with `Cubeventory`, which is a way to visually represent items and their weights
on a grid, similar to how a few video game inventories work, such as some Resident Evil, where each item occupies a number
of tiles in a certain shape.

I wanted to create an online version of this, because it seemed like a fun idea, and try as I might, I couldn't
find any existing implementations of this. And while I was at it, I thought, I might as well create a fully featured
character sheet with a few bells and whistles.

## The Scope

Scope? What's a scope? Well, I suppose I should at least provide a general outline.

The features of this application are as follows:

* Track one or more characters in a number of systems
  * Systems are represented as a ruleset which defines which fields are present and how they interact.
* Track each characters inventory using the cubeventory system.
  * The size of the inventory can vary depending on certain stats defined by the ruleset
  * A library of items is provided by default and custom items can easily be created on the fly
  * A shop system enables buying and selling items easily
* To use the system you create a session
  * A session allows a GM to access players characters and provide shops the players may use
  * For lone players a session allows data to be accessed from anywhere with internet access
* At some point there may be a local mode which stores character data in the browser only (maybe)