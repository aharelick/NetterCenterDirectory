//does not yet account for longhand of abreviations 

$(document).ready(function() {
    var availableTags = [
      "literacy",
      "elem. ed.", // elementary education
      "MS ed.", // middle school education
      "HS ed.", //high school education
      "adult ed.", //adult education
      "mentoring",
      "math",
      "science",
      "asp", //after school program
      "1 to 1", //one to one tutoring
      "PRI", //penn reading initiative
      "CSSP", //community school student partnerships
      "UNI", //urban nutirition initiative
      "CACR", //college access and career readiness
      "CAP", //community arts partnership
      "MAS", //Moelis Access Science
      "PPPS", //Penn program for public service
      "Penn VIPS", //Penn Volunteers in Public service
      "ABCS", //Academically based community service
      "YQ", //Young Quakers
      "sports", //UACS Sports Program
      "preceptorial", //Participation in Zuckerman preceptorial
      "pipeline", //Pipeline program
      "silverman", //Silverman fellows program 
      "jumpstart", //Participation in URBS178 Junior Jumpstart CACR program
      "NSAB", //Member of the Netter Student Advisory Board
      "Comegys", //Comegys Elementary School
      "Huey", //Huey Elementary School
      "Sayre", //Sayre High School
      "West", //West High School
      "Lea" //Lea Elementary School
    ];
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  });