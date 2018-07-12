 $(document).ready(function(){

   $(document).ready(function(){
     var date_input=$('input[name="date"]');
     var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
     var options={
     format: 'mm/yyyy',
     container: container,
     startView: "months",
     minViewMode: "months",
     todayHighlight: true,
     autoclose: true,

   };
   date_input.datepicker(options);
  })

    $('#dash1').hover(function(){ // hover in
        $('#dash').attr("src", "image/icons/dashboard_hover.png");
    }, function(){ // hover out
        $('#dash').attr("src", "image/icons/dashboard.png");
    });

    $('#edge1').hover(function(){ // hover in
        $('#edge').attr("src", "image/icons/edge_selected.png");
    }, function(){ // hover out
        $('#edge').attr("src", "image/icons/edge.png");
    });

    // $('#app1').click(function(){ // hover in
    //     $('#app').attr("src", "image/icons/apps_hover.png");
    //     $('#app1').removeClass("list-items");
    //     $('#app1').addClass("active-list-items");
    // });

    $('#app1').hover(function(){ // hover in
        $('#app').attr("src", "image/icons/apps_hover.png");
    }, function(){ // hover out
        $('#app').attr("src", "image/icons/apps.png");
    });

    $('#cloudlet1').hover(function(){ // hover in
        $('#cloudlet').attr("src", "image/icons/cloudlet_selected.png");
    }, function(){ // hover out
        $('#cloudlet').attr("src", "image/icons/cloudlet.png");
    });

    $('#micro1').hover(function(){ // hover in
        $('#micro').attr("src", "image/icons/microservices_hover.png");
    }, function(){ // hover out
        $('#micro').attr("src", "image/icons/microservices.png");
    });

    $('#monitor1').hover(function(){ // hover in
        $('#monitor').attr("src", "image/icons/monitoring_hover.png");
    }, function(){ // hover out
        $('#monitor').attr("src", "image/icons/monitoring.png");
    });

    $('#revenue1').hover(function(){ // hover in
        $('#revenue').attr("src", "image/icons/revenue_hover.png");
    }, function(){ // hover out
        $('#revenue').attr("src", "image/icons/revenue.png");
    });

    $('#telco1').hover(function(){ // hover in
        $('#telco').attr("src", "image/icons/telco_selected.png");
    }, function(){ // hover out
        $('#telco').attr("src", "image/icons/telco.png");
    });

    $('#feedback').hover(function(){ // hover in
        $('#feedback').attr("src", "image/icons/feedback_hover.png");
    }, function(){ // hover out
        $('#feedback').attr("src", "image/icons/feedback.png");
    });

    $('#documentation').hover(function(){ // hover in
        $('#documentation').attr("src", "image/icons/documentation_hover.png");
    }, function(){ // hover out
        $('#documentation').attr("src", "image/icons/documentation.png");
    });

    $('#p').hover(function(){ // hover in
        $('#p').attr("src", "image/icons/p.png");
    }, function(){ // hover out
        $('#p').attr("src", "image/icons/p.png");
    });

    $('#onBoard').hover(function(){ // hover in
        $('#onBoard').attr("src", "image/button/onboard_hover.png");
    }, function(){ // hover out
        $('#onBoard').attr("src", "image/button/onboard.png");
    });

    $("#allApp").click(function(){
       $("#allApp").removeClass("link");
       $("#myApp").removeClass("tabs");
       $("#myApp").addClass("link");
       $("#allApp").addClass("tabs");
   });

     $("#myApp").click(function(){
        $("#myApp").removeClass("link");
        $("#allApp").removeClass("tabs");
        $("#allApp").addClass("link");
        $("#myApp").addClass("tabs");
    });

});
