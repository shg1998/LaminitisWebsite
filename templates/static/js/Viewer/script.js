$(document).ready(function () {
    
    var toggle = $('#ss_toggle');
    var menu = $('#ss_menu');
    var rot;

    $('#ss_toggle').on('click', function (ev) {
        rot = parseInt($(this).data('rot')) - 180;
        menu.css('transform', 'rotate(' + rot + 'deg)');
        menu.css('webkitTransform', 'rotate(' + rot + 'deg)');
        if ((rot / 180) % 2 == 0) {
            //Moving in
            toggle.parent().addClass('ss_active');
            toggle.addClass('close');
        } else {
            //Moving Out
            toggle.parent().removeClass('ss_active');
            toggle.removeClass('close');
        }
        $(this).data('rot', rot);
    });

    menu.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        if ((rot / 180) % 2 == 0) {
            $('#ss_menu div i').addClass('ss_animate');
        } else {
            $('#ss_menu div i').removeClass('ss_animate');
        }
    });

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36251023-1']);
    _gaq.push(['_setDomainName', 'jqueryscript.net']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    var XPosition;
    var YPosition;
    var i = 0;
    var points = [];
    var j = 0;

    var currentURL = document.URL;
    var res = currentURL.split("/");

    var Url = 'http://127.0.0.1:8000/webservice/getImage/' + res[4] + "/" + res[5] + "/";


    WB=document.getElementById("WorkBench");

    var canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    img = new Image();
    img.src = Url;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        WB.height=img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.removeAttribute("data-caman-id");
    };

    let fileName = "";
    const revertBtn = document.getElementById("revert-btn");
    const downloadBtn = document.getElementById("download-btn");
    $(".drawDiv").removeAttr("style");
    $(".dkonvajs-content").removeAttr("style");

    var result;
    //get url of image (image address):
    var req = new XMLHttpRequest();
    req.open('GET',Url);
    req.onload = function(){
        console.log(req.responseText);
    };
    req.send();
    // var str = document.Url;
    // console.log(str);
    



        //add filter and effects:
        document.addEventListener("click", e => {
            if (e.target.classList.contains("filter-btn")) {
                if (e.target.classList.contains("brightness-add")) {
                    Caman("#canvas", img, function () {
                        this.brightness(5).render();
                    });
                } else if (e.target.classList.contains("brightness-remove")) {
                    Caman("#canvas", img, function () {
                        this.brightness(-5).render();
                    });
                } else if (e.target.classList.contains("contrast-add")) {
                    Caman("#canvas", img, function () {
                        this.contrast(5).render();
                    });
                } else if (e.target.classList.contains("contrast-remove")) {
                    Caman("#canvas", img, function () {
                        this.contrast(-5).render();
                    });
                }
            }

        });
    $(".punctuation").click(function (e) {

        //for PunctuationPunctuation on canvas!

        $("#canvas").click(function (ev) {
            mouseX = ev.pageX;
            mouseY = ev.pageY;
            // console.log(mouseX + " " + mouseY);
            var color = "rgb(248, 248, 91)";
            var size = "7px";
            XPosition = mouseX;
            YPosition = mouseY;

            points.push({
                xpos: XPosition,
                ypos: YPosition
            });
            i++;
            console.log(i);

            $("body").append(
                $(`<canvas id= ${i}></canvas>`)
                    .css("position", "absolute")
                    .css("top", mouseY + "px")
                    .css("left", mouseX + "px")
                    .css("width", size)
                    .css("height", size)
                    .css("background-color", color)
                    .css("cursor", "move")
                    .css("border-radius", "30px")
            );
        });
    });

    //download:
    downloadBtn.addEventListener("click", () => {
        //get the file extension:
        const fileExt = fileName.slice(-4);
        //initialize new file name
        let newFileName;

        //check image type
        if (fileExt === ".jpg" || fileExt === "png") {
            newFileName = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
        }

        //call download
        download(canvas, newFileName);
    });

    function download(canvas, filename) {
        // init event
        let ev;
        //creat Link
        const link = document.createElement("a");
        //set Props:
        link.download = filename;
        link.href = canvas.toDataURL("image/jpg", 0.8);
        //new mouse event
        ev = new MouseEvent("click");
        //dispatch ev
        link.dispatchEvent(ev);
    }
    $(".Erase-btn").click(function (e) {
        for (var k = 1; k <= i; k++) {
            $(`#${k}`).remove();
        }
    });
    $(".getPoints-btn").click(function (e) {
        for (var j = 0; j < points.length; j++) {
            console.log("x = " + points[j].xpos + "\n" + "y = " + points[j].ypos);
        }
        // var getJSON = function (url, callback) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.open("GET", url, true);
        //     xhr.responseType = "json";

        //     xhr.onload = function () {
        //         var status = xhr.status;

        //         if (status == 200) {
        //             callback(null, xhr.response);
        //         } else {
        //             callback(status);
        //         }
        //     };

        //     xhr.send();
        // };

        //         getJSON("getPoints.webService", function (err, data) {
        //             if (err != null) {
        //                 console.error(err);
        //             } else {
        //                 var text = `Date: ${data.date}
        // Time: ${data.time}
        // Unix time: ${data.milliseconds_since_epoch}`;

        //                 console.log(text);
        //             }
        //         });
    });
    $(".addPoints-btn").click(function (e) {
        //first method
        // sendJSON(points);

        //second method
        //     let xhr = new XMLHttpRequest();
        //     let url = "server";

        //     // open a connection
        //     xhr.open("POST", "addPoints", true);
        //     var myJson = JSON.stringify(points);
        //     xhr.setRequestHeader("Content-Type", "application/json");
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState === 4 && xhr.status === 200) {
        //             // Print received data from server
        //             console.log(this.responseText);
        //         }
        //     };

        //     xhr.send({
        //         data: {
        //             param: myJson
        //         }
        //     });
        // });
    });

    // function sendJSON(object) {
    //     // Creating a XHR object
    //     let xhr = new XMLHttpRequest();
    //     let url = "addPoints.webService";

    //     // open a connection
    //     xhr.open("POST", url, true);

    //     // Set the request header i.e. which type of content you are sending
    //     xhr.setRequestHeader("Content-Type", "application/json");

    //     // Create a state change callback
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             // Print received data from server
    //             console.log(this.responseText);
    //         }
    //     };

    //     // Converting JSON data to string
    //     var data = [];
    //     for (let i = 0; i < object.length; i++) {
    //         data[i] = JSON.stringify({
    //             XPosition: object[i].xpos,
    //             YPosition: object[i].ypos
    //         });
    //     }
    //     // console.log(object[0].xpos);
    //     // console.log(object[0].ypos);

    //     // Sending data with the request
    //     xhr.send(data);
    // }

    // for undo
    $("#undo").click(function (e) {
        $(`#${i - j}`).removeAttr("style");
        j += 1;
        console.log(j);
    });
    // redo : Todo!
    //     $(".redo").click(function (e) { 
    //         $(`#${i - j}`).Attr("css", { backgroundColor: "gray", position: absolute ,  });
    //         j += 1;
    //         console.log(j);

    //     });
    revertBtn.addEventListener("click", e => {
        Caman("#canvas", img, function () {
            this.revert();
        });
    });
});

