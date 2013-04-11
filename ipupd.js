var exe = require("child_process").exec;

console.log("making request to checkip.dyndns.com...");
exe("curl checkip.dyndns.com", function (err, stdout, stderr) {

    if(!(err && stderr)) {
        console.log("stdout is: " + stdout);

        var re = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
        var ip = re.exec(stdout);

        if (ip.length > -1) {
            console.log("ip found: " + ip);

            var html = "<html><head><meta http-equiv='refresh' content='0;http://" + ip + ":8080'>";
            html += "</head><body><a href='http://" + ip + ":8080'/>";
            html += "</body></html>";

            var fs = require('fs');
            fs.writeFile("index.html", html, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("saved ip in html redirect file");

                    var ftpcl = require('ftp');
                    var c = new ftpcl();
                    c.on('ready', function() {
                        c.put('index.html', 'index.html', function(err) {
                            if (err) throw err;
                            c.end();
                        });
                    });

                    console.log("read auth.txt");
                    fs.readFile('auth.txt', function (err, data) {
                        if (err) throw err;
                        console.log("connect to ftp account");
                        c.connect(data);
                    });
                }
            });

        }
        c.destroy();

    }
    else {
        console.log(err || stderr);
    }
});