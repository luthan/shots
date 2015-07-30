if (Meteor.isClient) {
  var employee = docCookies.getItem("SCRAPEMAIL");
  if(!employee){
    employee = "pbenetis@smithbucklin.com";
  }
  Template.body.helpers({
    employee: employee,
    timeSlot: function(){return Slots.findOne({employees:employee})},
    hours: function(){
      return Hours.find({});
    }
  });
  
  Template.hour.helpers({
    text: "hello",
    hourDisplay: function(name){
      if(name < 12){
        return name + ' am';
      } else if(name === 12){
        return name + ' pm';
      } else if(name > 12){
        return (name - 12) + ' pm';
      }
    }
  });
  
  Template.slot.helpers({
    calculateSlots: function(x){
      var y = Slots.findOne(x);
      if(5 - y.employees.length > 0){
        return true;
      } else {
        return false;
      }
    },
    slotsLeft: function(x){
      var y = Slots.findOne(x);
      return 5 - y.employees.length;
    },
    getCurrentHourId: function(parentContext){
      return parentContext._id;
    },
    getCurrentHourName: function(parentContext){
      return parentContext.name;
    },
    checkIfOwn: function(x){
      var y = Slots.findOne({_id:x,employees:employee});
      if(y){
        return true;
      }
    },
    showName: function(x){
      var y = Slots.findOne(x);
      return y.name;
    }
  })
  
  Template.hour.events({
    'click button':function(event){
      slotId = event.target.id;
      var y = Slots.findOne({_id:slotId,employees:employee});
      if(y){
        Meteor.call('removeEmployee', slotId, employee, function(err, response){
        });
      } else{
        Meteor.call('insertEmployee', slotId, employee, function(err, response){
  
        });
      }
    }
  });
}

Slots = new Mongo.Collection("slots");
Hours = new Mongo.Collection("hours");

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      insertEmployee: function(slotId, employee){
        //remove the employee from their current slot
        Slots.update({employees:employee},{$pull:{employees:employee}});
        //add to the new slot
        Slots.update({_id:slotId},{$push:{employees:employee}});
      },
      removeEmployee: function(slotId, employee){
        //remove the employee from their current slot
        Slots.update({employees:employee},{$pull:{employees:employee}});
        //add to the new slot
        //Slots.update({_id:slotId},{$push:{employees:employee}});
      }
    });
        
        if(Hours.find().count() === 0){
          if(Hours){
            var hours = [9,10,11,12,13];
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
                var slot = Slots.findOne({_id:slotId});
                Hours.update({_id:hourId},{$push:{"slots":slotId}});
                console.log(Hours.findOne({_id:hourId}));
              });
            });
          }
        }
  });
}
