if (Meteor.isClient) {
  // counter starts at 0
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
}

Hours = new Mongo.Collection("hours");
Slots = new Mongo.Collection("slots");

Schema = {};

Schema.Hour = new SimpleSchema({
  name: {
    type: Number
  },
  slots: {
    type: [Schema.Slot],
    optional: true
  }
});

Schema.Slot = new SimpleSchema({
  name: {
    type: String
  },
  employees: {
    type: [String]
  }
});

Hours.attachSchema(Schema.Hour);
Slots.attachSchema(Schema.Slot);





if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var hours = [9,10,11,12];
    var slots = ["00","15","30","45"];
    
  hours.forEach(function(x,y){
    var h = {
      name: x,
      slots: []
    }
    
    var hourId = Hours.insert(h);
    
    slots.forEach(function(x,y){
      var s = {
        name: x,
        employees: []
      }
      var slotId = Slots.insert(s);
      Hours.update({_id:hourId},{$push:{slots:slotId}});
    });
  });
    
    
    
    
    
    
    
    
      // console.log(b)
      // var hour = Hours.find({_id:b});
      // console.log(hour);
      // hour.slots.push(s)
    
  });
}
