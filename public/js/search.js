//improved but not perfect

$(document).ready(function() {
    var availableTags = [
      "literacy",
      {label: "elementary education", value: "elem. ed."}, 
      {label: "middle school education", value: "MS ed."},
      {label: "high school education", value: "HS ed."}, 
      {label: "adult education", value: "adult ed."}, 
      {label: "mentoring", value: "mentoring"},
      {label: "math", value: "math"},
      {label: "science", value: "science"},
      {label: "after school program", value: "ASP"}, 
      {label: "one to one tutoring", value: "1 to 1"}, 
      {label: "penn reading initiative", value: "PRI"}, 
      {label: "community school student partnerships", value: "CSSP"}, 
      {label: "urban nutirition initiative", value: "UNI"}, 
      {label: "college access and career readiness", value: "CACR"}, 
      {label: "community arts partnership", value: "CAP"}, 
      {label: "Moelis Access Science", value: "MAS"},
      {label: "Penn program for public service", value: "PPPS"}, 
      {label: "Penn Volunteers in Public service", value: "Penn VIPS"}, 
      {label: "Academically based community service", value: "ABCS"}, 
      {label: "Young Quakers", value: "YQ"}, 
      {label: "UACS Sports Program", value: "sports"}, 
      {label: "Participation in Zuckerman preceptorial", value: "preceptorial"}, 
      {label: "Pipeline program", value: "pipeline"}, 
      {label: "Silverman fellows program", value: "silverman"},
      {label: "Participation in URBS178 Junior Jumpstart CACR program", value: "jumpstart"}, //]
      {label: "Member of the Netter Student Advisory Board", value: "NSAB"}, 
      {label: "Comegys Elementary School", value: "Comegys"}, 
      {label: "Huey Elementary School", value: "Huey"}, 
      {label: "Sayre High School", value: "Sayre"}, 
      {label: "West High School", value: "West"}, 
     {label: "Lea Elementary School", value: "Lea"} 
    ];
    $( ".tag-search" ).autocomplete({
      source: availableTags
    });
  });