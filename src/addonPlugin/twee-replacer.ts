import type { ModBootJsonAddonPlugin } from "./types.ts";

export const TweeReplacer: ModBootJsonAddonPlugin = {
  modName: "TweeReplacer",
  addonName: "TweeReplacerAddon",
  modVersion: "1.0.0",
  params: [
    {
      passage: "PassageHeader",
      findString: "<<unset $bypassHeader>>",
      replace: "<<unset $bypassHeader>>\n<<iCandyHeader>><div id='addMsg'></div>",
    },
    {
      passage: "PassageFooter",
      findString: "<div id=\"gameVersionDisplay\">",
      replace: "<<iCandyFooter>>\n<div id=\"gameVersionDisplay\">",
    },
    {
      passage: "Widgets Journal",
      findRegex: "<<if\\s\\$antiquemoney[\\s\\S]+<br><</if>>\n<</widget>>",
      replaceFile: "replaceFiles/journal.txt",
    },
    {
      passage: "Widgets Difficulty",
      findString: "<<set $skulduggeryroll to random(1, 1000)>>",
      replace: "<<set $skulduggeryroll to random(1, 1000)>>\n<<if R.mechStats.toolset is 1>><<set $skulduggeryroll *= 1.1>><<set $skulduggerydifficulty *= 0.95>><</if>>",
    },
    {
      passage: "Widgets Sleep",
      findString: "<<if $ruffledisable is \"f\">>\n\t\t<<set $_hair to",
      replace: "<<if $ruffledisable is \"f\" and iCandy.getConfig('keepHairs') is false >>\n\t\t<<set $_hair to",
    },
    {
      passage: "Widgets",
      findString: "<<widget \"roomoptions\">>",
      replace: "<<widget \"roomoptions\">>\n\n<<iCandyRoomOption>>\n\n",
    },
    {
      passage: "Widgets",
      findString: "<img id=\"location\" @src=\"_imgLoc + _weather_display + '/wolf_cave'+_dayState+'.png'\">",
      replaceFile: "replaceFiles/locationImage.txt",
    },
    {
      passage: "Widgets Stats",
      findString: "\n\t\t<<set $drugged += Math.floor(_args[0] * _drugged_mod)>>\n",
      replaceFile: "replaceFiles/drugsWidget.txt",
    },
    {
      passage: "Widgets Stats",
      findString: "\n\t\t<<set $drunk += Math.floor(_args[0] * _drunk_mod)>>\n",
      replaceFile: "replaceFiles/drunkWidget.txt",
    },
    {
      passage: "Widgets Bodywriting",
      findString: "<<if (($enemyarousal + ($enemytrust * 5) - $enemyanger + ($attractiveness / 10) * (currentSkillValue(\"seductionskill\") / 200)) gte 1000)>>",
      replace: "<<if (($enemyarousal + ($enemytrust * 5.5) - $enemyanger + ($attractiveness / 10) * (currentSkillValue(\"seductionskill\") / 100)) gte 880)>>",
    },
    {
      passage: "Widgets Bodywriting",
      findString: "<<elseif (($enemyarousal + ($enemytrust * 5) - $enemyanger + ($attractiveness / 10) * (currentSkillValue(\"seductionskill\") / 200)) gte 500)>>",
      replace: "<<elseif (($enemyarousal + ($enemytrust * 5.5) - $enemyanger + ($attractiveness / 10) * (currentSkillValue(\"seductionskill\") / 100)) gte 440)>>",
    },
    {
      passage: "Widgets Bodywriting",
      findString: "<<elseif $skin[_args[0]].degree lte ($enemyarousal + ($enemytrust * 5) - $enemyanger + ($attractiveness / 10) * (currentSkillValue(\"seductionskill\") / 200))>>",
      replace: "<<elseif $skin[_args[0]].degree lte ($enemyarousal * 2 + ($enemytrust * 5) - $enemyanger + ($attractiveness / 5) * (currentSkillValue(\"seductionskill\") / 100))>>",
    },
    {
      passage: "Brothel",
      findString: "<<if $brotheljob is 1>>",
      replace: "\n<<if $brotheljob is 1>>\n<<brothelDrugs>>",
    },
  ],
};
