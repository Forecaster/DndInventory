
# Dice string specification


## Types of dice
The built-in dice roller supports an arbitrary number of dice of an arbitrary size.
Though negative values cannot be rolled or used as a size value.

Fudge dice are also supported and can result in -1, 0 or 1 being rolled.

All dice are displayed in a rounded square resembling a d6 regardless of actual size.
The actual die size is displayed underneath the result.

#
## A regular dice string

To roll any die or dice, simply write a string containing at least one set of dice, such as
`d6` or `3d10`.

This should roll the respective dice and display the result without fuzz.

#
## Expressions

You can put one of the following mathematical operators in the string: `^ * / + -`
along with regular numbers. This will create a mathematical expression that will be
evaluated after any dice groups within have been rolled.


If parenthesis `()` are used to group parts together.
Then groups will be evaluated first starting with the smallest.

Essentially `PEMDAS` (the order the  operators are in above) will be followed.

>Examples
> 
>> `2 + 4` would always output `6`.
>> 
>> `d6 + 4` would roll the d6 first, then calculate a result between 5 and 12.
> 
>> Because multiplication is evaluated first `2 * 6 + 2` would output 14. But if `2 * (6 + 2)`
>> is given, because of the parenthesis, 6 + 2 would be evaluated first, resulting in `2 * 8`
>> which is 16 instead.

#
## Modifiers
A modifier is affixed after a dice group. Modifiers evaluate results in certain ways
and performs actions based on the evaluation. Some only change how the dice are displayed,
but others modify the results, or even discards them entirely.

#
### Targets
To determine which results the modifier should apply to one of the following operators may
be appended after a modifier.

> **Do note!** Certain modifiers do not use an operator. Instead, the target is specified directly
> after the keyword. Ex: `4d6dl1` though in this example the 1 at the end is redundant as
> that is the default value if the target is omitted.

* `>`  Greater than
* `>=` Greater than or equal to
* `<`  Less than
* `<=` Less than or equal to
* `=`  Equal to

> While all modifiers require a target, most will simply assume the current die size or
> the lowest value as the target if none has been specified in the dice string. Those that
> do not use a die size as the target but instead uses a number of dice will
> default to 1 unless a target is specified.

#
### Modifier type
The dice roller supports a number of ways of rolling dice.
These will be explained in further detail below, but in brief they are as follows:

* Exploding (!)
* Exploding, compounding (!!)
* Exploding, penetrating (!p)
* Exploding, cascading (!c)
* Drop lowest (dl)
* Drop highest (dh)
* Keep lowest (kl)
* Keep highest (kh)
* Drop (dr)
* Keep (kp)
* Critical success (cs)
* Critical failure (cf)
* Reroll (r)
* Reroll once (ro)
* Success
* Failure

#
### Exploding
> `!` is the postfix for regular exploding dice. Ex: `2d10!`
> 
> *Supports operators*
>
> *Default operator: >={die size}*

Exploding simply means if the result on an exploding dice met the target, an additional die
will be rolled of the same type.

> Examples
>> If you roll a `d6!` and you get a 6, you get to roll again and add
>> the second result to the first one.
>>
>> Our result set would go from [6] to [6, 4] (here we rolled a 4 on the extra die).

The additional dice may also explode, meaning there's a very small but non-zero chance
you'll get to keep rolling indefinitely.

#
### Exploding compounding
*Used in Shadowrun*
> `!!` is the postfix for exploding compounding dice. Ex: `2d10!!`
> 
> *Supports operators*
>
> *Default operator: >={die size}*

This is essentially the same as exploding dice, but after a new die is rolled the result is
immediately added to the original result.

> With this you may see results that vastly exceed the size of the die. This is normal and not
> a cause for alarm. DO NOT PANIC.
> 
> Examples
> 
>> If we roll a `d6` and get a 6 we roll again, but rather than getting a result set
>> with an additional result in it like regular exploding, we add the new result to the
>> original 6: [6] to [9] (if we rolled a 3 on the extra die).

#
### Exploding penetrating
*Used in Hackmaster*
> `!p` is the postfix for exploding penetrating dice. Ex: `2d10!p`
>
> *Supports operators*
> 
> *Default operator: >={die size}*

When a penetrating explosion happens an additional die is rolled exactly like regular exploding
dice. The difference is that for each exploding die you subtract 1 from the result.

> From what I can tell nothing outside of Hackmaster uses this, but maybe it will be useful
> for something...
> 
> Examples
> 
>> Here we do the same thing, we roll a `d6` and get a 6, then we roll an additional die,
>> and add the result to our set, but before we add it we subtract 1 from it.
>> 
>> So [6] to [6, 3] (if we rolled a 4 on the extra die).

#
### Exploding cascading
> `!c` is the postfix for exploding cascading dice. Ex: `2d10!c`
>
> *Supports operators*
> 
> *Default operator: >={die size}*

This concept comes from [this reddit post](https://www.reddit.com/r/RPGdesign/comments/ne975k/cascading_dice_a_more_stable_version_of_exploding/)
and attempts to address some of the issues with exploding dice.

When rolling cascading exploding dice and a die explodes, instead of rolling an additional
die of the same size, a die one step smalled is rolled instead. As usual this die may also
explode. If that happens you decrease the new additional die by another step, and so on.

> Once you've gotten down to a d4 you're pretty much forced to stop. Unless you feel like
> flipping a coin I suppose. A coin is basically a d2.
> 
> Examples
> 
>> If we roll our `d6` once again and roll a 6 we then roll a d4 as our additional dice.
>> So [6] to [6, 4] (here we rolled a 4 on our additional ´d4`, but since we have
>> no die smaller than that we are forced to stop exploding).

#
### Drop lowest
> `dl` is the postfix for drop lowest. Ex: `2d10dl` or `6d10dl2`
> 
> *Does **not** support operators*
>
> Default target: 1

The drop lowest modifier will drop a number of dice equal to the target value starting with the
lowest roll result and working upwards.

> If the target number is equal to or greater than the number of dice rolled all results will
> be dropped.

> This (and the following) may also drop all results if the target is too big.

#
### Drop highest
> `dh` is the postfix for drop highest. Ex: `2d10dh` or `6d10dh2`
>
> *Does **not** support operators*
>
> Default target: 1

Identical to `Drop lowest`, except it will start at the highest roll result and work
its way downwards.

#
### Keep lowest
> `kl` is the postfix for keep lowest. Ex: `2d10kl` or `6d10kl2`
>
> *Does **not** support operators*
>
> Default target: 1

Again, fairly identical to previous `keep` modifiers, except it instead **preserves** results
instead of dropping them, starting at the lowest value and working its way up until
it reaches the target amount.

> This (and the following) may also keep all results if the target is too big.

> This can be used to roll with disadvantage with `2d20kl`.
> 
#
### Keep highest
> `kh` is the postfix for keep highest. Ex: `2d10kh` or `6d10kh2`
>
> *Does **not** support operators*
> 
> Default target: 1

This preserves results starting at the highest and working its way down. Pretty simple.

> This can be used to roll with advantage with `2d20kh`.


#
### Keep
> `kp` is the postfix for drop. Ex: `2d10kp` or `6d10kp>=2`
>
> *Supports operators*
>
> *Default operator: >={die size}*

Keep just drops dice that do not match the target value.

#
### Drop
> `dr` is the postfix for drop. Ex: `2d10dr` or `6d10dr<=2`
> 
> *Supports operators*
> 
> *Default operator: <=1*

Drop just drops dice that match the target value.

#
### Critical success
> `cs` is the postfix for critical success. Ex: `2d10cs` or `6d10cs>=9`
>
> *Supports operators*
>
> *Default operator: >={die size}*

The critical success modifier will cause results that match the target value to
be highlighted with an animation to make them extra special, and very easy to spot!

It may also, depending on the ruleset, affect subsequent rolls, such as damage rolls.

#
### Critical failure
> `cf` is the postfix for critical failure. Ex: `2d10cf` or `6d10cf<=2`
>
> *Supports operators*
>
> *Default operator: <=1*

The critical failure modifier will cause results that match the target value to
be highlighted with an animation to make them extra terrible (and also easy to spot).

It may also, depending on the ruleset, affect subsequent rolls.

#
### Reroll
> `r` is the postfix for reroll. Ex: `2d10r` or `6d10r<=2`
>
> *Supports operators*
> 
> *Default operator: <=1*

The reroll modifier will cause results that match the target value to be re-rolled.
This is similar to the exploding modifier, but here the new result replaces the previous.
For better or worse.

#
### Reroll once
> `ro` is the postfix for reroll once. Ex: `2d10ro` or `6d10ro<=2`
>
> *Supports operators*
>
> *Default operator: <=1*

This work exactly like the previous modifier, but each result can only be re-rolled once.

#
### Success & Failure
> There is no postfix.
>
> *IS operators*

These last two are a little special, as they aren't really modifiers, but target
operators themselves.

When a `>=` or `>` operator is used without a modifier before it, it causes results
that match to be marked as `Successes`!

Conversely, when a `<=` or `<` operator is used without a modifier it causes results
that match to me marked as `Failures`.

This can be used by certain rulesets for games where you are not interested in the total
value of the dice rolled, but rather how many dice rolled above or below a certain value.

> Example:
>> To roll a number of d6 dice and count how many rolled a 4 or above you would do `4d6>=4`
>> We can also do `4d6<4` to roll a number of d6 dice and count how many rolled below a 4.
>>
>> We can also do both at once simply by doing `4d6>=4<4` which would count dice rolling
>> 4 or above as successes, and dice rolling below 4 as failures.




#