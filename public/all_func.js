//variable for .value (typing, select )
type_form=["pa_name","pa_address","pa_offer","pa_sex","pa_13id1","pa_13id2","pa_13id3","pa_13id4",
"pa_13id5","pa_birth","pa_blood","pa_occu","pa_phone","pa_h_available","pa_vivisec_text","pa_drug_a_text",
"pa_food_a_text","pa_drug_u","pa_disease"];
//variable for checked
check_form=["pa_headache","pa_fever","pa_vivisec","pa_drug_a","pa_food_a","pa_smoke",
"pa_alcohol","pa_exercise"];
//collapse
collapse_form=["pa_vivisec","pa_drug_a","pa_food_a"];

function writeNewVnHnData(){
    firebase.database().ref("Patient/vn_"+document.getElementById("vn").value).set({
        hn: document.getElementById("hn").value
    });
    document.getElementById("vn").value="";
    document.getElementById("hn").value="";
}

function validateVnHn(){
    document.getElementById("index_redirecting").innerHTML="Validating";
    if(document.getElementById("vn").value.length==0){
        document.getElementById("vn_err").innerHTML="Please input your VN";
        return;
    }
    document.getElementById("vn_err").innerHTML="";
    if(document.getElementById("hn").value.length==0){
        document.getElementById("hn_err").innerHTML="Please input your HN";
        return;
    }
    document.getElementById("hn_err").innerHTML="";
    //console.log(document.getElementById("vn").value,document.getElementById("hn").value);
    var ref=firebase.database().ref("Patient");
    ref.once('value',function(snapshot){
        if(snapshot.hasChild('vn_'+document.getElementById("vn").value)){
            firebase.database().ref("Patient/vn_"+document.getElementById("vn").value).once('value',function(snapshot){
                var real_pass=snapshot.val().hn;
                if(real_pass===document.getElementById('hn').value){
                    sessionStorage.setItem("pa_Vn",document.getElementById("vn").value);
                    sessionStorage.setItem("pa_Hn",document.getElementById("hn").value);
                    document.getElementById("index_redirecting").innerHTML="Redirecting to main page";
                    window.location.replace('pa_m_record.html');
                    // location.href="pa_m_record.html";
                }
                else{
                    alert("มีเลข VN นี้ แต่ HN ไม่ถูกต้องครับ");
                }
            });
        }else{
            alert("ไม่มีเลข VN นี้นะครับ");
        }
    });

};

function pa_m_record_init(){
    if(sessionStorage.getItem("pa_Vn")==null){
        location.replace('..');
        exit;
    }
    //console.log(type_form);
    document.getElementById("show_VN").innerHTML="VN: "+sessionStorage.getItem("pa_Vn");
    document.getElementById("show_HN").innerHTML="HN: "+sessionStorage.getItem("pa_Hn");
    document.getElementById("pa_m_status").innerHTML="Loading Latest Data";
    var ref=firebase.database().ref("Patient/vn_"+sessionStorage.getItem("pa_Vn"));
    ref.once('value',function(snapshot){
        var ans=snapshot.val();
        //console.log(Object.keys(ans));
        var key;
        for(key in ans){
            //console.log(key);
            if(key!='hn'){
                if(type_form.includes(key)){
                    document.getElementById(key).value=ans[key];
                }
                else{
                    document.getElementById(key).checked=ans[key];
                }
            }
        }
        for(key in collapse_form){
            //console.log(key,ans[key]);
            if(ans[collapse_form[key]]==true){
                check_text(collapse_form[key].slice(3,collapse_form[key].length));
            }
        }
        document.getElementById("pa_m_status").innerHTML="Load Finished";
    });
}

function check_text(input){
    //console.log(input+"_info");
    var checkBox=document.getElementById("pa_"+input);
    var text=document.getElementById(input+"_info");
    if(checkBox.checked){
        text.style.display="block";
    }
    else{
        text.style.display="none";
    }
}

function pa_submit(){
    document.getElementById("pa_m_status").innerHTML="Submitting Data";
    var ref=firebase.database().ref("Patient/vn_"+sessionStorage.getItem('pa_Vn'));
    pa_arg={};
    var i;
    for(i=0;i<type_form.length;i++){
        pa_arg[type_form[i]]=document.getElementById(type_form[i]).value;
    }
    for(i=0;i<check_form.length;i++){
        pa_arg[check_form[i]]=document.getElementById(check_form[i]).checked;
        if(collapse_form.includes(check_form[i])&& pa_arg[check_form[i]]==false){
            pa_arg[check_form[i]+"_text"]="";
        }
    }
    //pa_arg['hn']=sessionStorage.getItem('pa_Hn');
    ref.update(pa_arg);
    document.getElementById("pa_m_status").innerHTML="Submit Finished";
}

function logoutVnHn(){
    document.getElementById("pa_m_status").innerHTML="Logging Out";
    sessionStorage.clear();
    location.replace('..');
}