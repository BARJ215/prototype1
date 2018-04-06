var clist;

$(document).on("pagecreate","#main", function() {
    console.log("ractive");
    cList = new Ractive({
        el: "challengeBox",  
        data: {c:[
            {name:"Run 3 races",points: 1000},
            {name:"Beat estimate time",points: 1000},
            {name:"Invite a friend",points: 10000}
        ]},
        template: "#challengeTemplate"
    });
});
