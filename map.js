var express = require('express');
var app = express();
var axios = require("axios");
var port = process.env.PORT || 3003;
app.use(express.static('public_html'));

app.listen(port,function(){
    console.log("서버시작");
});

app.get("/pharmach_list",(req,res)=>{
        let api = async () => {
            let response=null;
            try {
                response = await axios.get("", {
                    params: {
                        "serviceKey": "",
                        "Q0": req.query.Q0,
                        "Q1": req.query.Q1,
                        "QT": req.query.QT,
                        "QN": req.query.QN,
                        "ORD": req.query.ORD,
                        "pageNo": req.query.pageNo,
                        "numOfRows": req.query.numOfRows
                    }
                });
            }
            catch (e){
                console.log(e);
            }
            return response;
        }
        api.then((response)=>{
            res.setHeader("Acess-Control-Allow-Origin","*");
            res.json(response.data,response.body);
        });
});