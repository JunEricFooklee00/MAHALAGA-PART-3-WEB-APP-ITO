const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const mongodb = require("./mongodb")
const templatePath = path.join(__dirname, "../HTML")
const multer = require("multer")
const cloudinary = require("./cloudinary")
const dataCheck = require("./dataCheck")
const url = require("url")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt')
const { spawn } = require('child_process')

app.use(express.static("HTML"))
app.use(express.static("."))
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "hbs", "ejs")
app.set("views", templatePath)
app.use(express.urlencoded({extended:false}))

app.get("/Sample", (req,res) => {
    res.render("LOCALS/Sample")
})

app.get("/ClientSettings", authenticateToken, (req,res) => {
    res.render("LOCALS/ClientInterfaces/ClientSettings")
    const user = req.user.user;
    const userId = req.user._id;
    console.log(user);

    try {
        if(user == "Client"){
            mongodb.getClients.findById(userId, (err, user) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('Internal Server Error');
                } else {
                    res.render('LOCALS/ClientInterfaces/ClientSettings', {user})
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server Error" });
    }
})

app.get("/EmployeeSettings", authenticateToken, (req,res) => {
    const user = req.user.user;
    const userId = req.user._id;
    console.log(user);

    try {
        if(user == "Employee"){
             mongodb.getEmployees.findById(userId, (err, user) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('Internal Server Error');
                } else {
                    res.render('LOCALS/EmployeeInterfaces/EmployeeSettings', {user})
                }
              });
            }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server Error" });
    }
})

app.post("/submitFinalJob", authenticateToken, async (req,res) => {
    try{
        const str = req.body.projectData.origValue;
        const origValue = parseInt(str);

        const data1 = {
            idUser:req.user.id,
            ProjectName:req.body.projectData.projName,
            ClientName:req.body.projectData.clientName,
            ContactNumber:req.body.projectData.cNumber,
            TypeOfWork:req.body.projectData.typeJob,
            Area:req.body.projectData.area,
            Unit:req.body.projectData.unit,
            Location:req.body.projectData.location,
            StartingDate:req.body.projectData.startDate,
            ExpectedFinishDate:req.body.projectData.expDate,
            ForecastedNum:origValue,
            SuggestedNum:req.body.projectData.sugValue,
        }

        let workersList = []
        workersList = req.body.projectData.selectedWorker

        const data2 = {}
        
        for(let i = 0; i < workersList.length; i++){
            data2["Worker" + (i + 1)] = workersList[i];
        }

        const data = Object.assign({}, data1, data2)
        console.log(data)
        
        const Jobs = mongodb.getJobOrder

        await Jobs.insertMany(data)
        .then(() => {
            res.json({ success:true })
        }) 
        .catch(() => {
            res.json({ success:false })
        })
    } catch(err){
        console.log(err)
    }
})

app.get("/Signupexample", (req,res) => {
    res.render("LOCALS/Signupexample")
})

app.get("/AdminCalendar", (req,res) => {
    res.render("LOCALS/AdminInterfaces/AdminCalendar")
})

app.get("/", (req,res) => {
    res.render("LOCALS/PortalPage")
})

app.get("/allform", (req,res) => {
    res.render("LOCALS/ForeReco")
})

app.get("/Interface", (req,res) => {
    res.render("LOCALS/Interface")
});

app.get("/testing", (req,res) => {
    res.render("LOCALS/testing")
});

app.get("/example", (req,res) => {
    res.render("LOCALS/example")
});

app.get("/gg", (req,res) => {
    res.render("LOCALS/gg")
});

app.get("/jobs",authenticateToken, async (req,res) => {
    const id = req.user.id

    const User = mongodb.getJobOrders

    User.find({idUser:id})
    .then((users) => res.send(users))
    .catch((err) => console.log(err))
})

app.get("/skilledWorker",authenticateToken, (req,res) => {
    const worker = req.query.worker

    const User = mongodb.getEmployees

    User.find({jobType:worker})
    .then((users) => res.send(users))
    .catch((err) => console.log(err))
})

app.get("/showRF", authenticateToken,async (req,res) => {
    let id = req.query.id

    const job = await mongodb.getJobOrders.findById([id])
    const workModel = job.TypeOfWork.slice(0, 2)

    if(workModel === "B2" || workModel === "C1" || workModel === "D1" || workModel === "D2" || workModel === "D3" || workModel === "E1" || workModel === "E2" || workModel === "G1" || workModel === "G2"|| workModel === "F1"){
        res.json({ success:true, job:job })
    } else res.json({ success:false, job:job })
})

app.get("/MachineLearningForm", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/ClientInterfaces/JobOrder", {list: docs, user:req.user})
        }
    })
})

app.get("/JobOrder", authenticateToken, (req,res) => {
    res.render("LOCALS/ClientInterfaces/JobOrder")
})

app.get("/Notification", (req,res) => {
    res.render("Notification")
})

app.get("/Schedule", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/AdminSchedule")
    else if(req.user.user === "Employee") res.render("Locals/EmployeeInterfaces/EmployeeSchedule")
    else if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientSchedule")
    else res.sendStatus(401)
})

app.post("/logout", (req,res) => {
    if(req.cookies.jwt_s1 && req.cookies.jwt_s2){
        res.clearCookie("jwt_s1")
        res.clearCookie("jwt_s2")
        res.send({ success: true });
    }
})

app.post("/JobOrder", authenticateToken, async (req,res) => {

        const data = {
            idUser:req.user.id,
            ProjectName:req.body.ProjectName,
            ContactNumber:req.body.cNumber,
            ClientName:req.body.Name,
            Area:req.body.Area,
            Unit:req.body.Unit,
            TypeOfWork:req.body.TypeOfWork,
            Location:req.body.Location,
            StartingDate:req.body.StartingDate,
            ExpectedFinishDate:req.body.ExpectedFinishDate,
        }

        const jobForm = mongodb.getJobOrders

        await jobForm.insertMany(data)
        .then(function () {
            res.json({ success:true })
        })
        .catch(function () {
            res.json({ success:false })
        })
})

app.post("/DeleteJob", async (req, res) => {
const id = req.body.id

try{
    const result = await mongodb.getJobOrders.findByIdAndDelete(id)
    if (!result) {
    return res.sendStatus(404)
    }
    res.json({ success: true })
} catch (err){
    console.error(err)
    res.status(500).json({ success: false, error: "Server Error" })
}
});

app.get("/portalpage", (req,res) => {
    res.render("LOCALS/portalpage")
})

app.get("/loginpage", (req,res) => {
    res.render("LOCALS/loginpage")
})

app.get("/signuppage", (req,res) => {
    res.render("LOCALS/signuppage")
})

app.get("/homepage", authenticateToken, (req, res) => {
    res.render("LOCALS/homepage")
})

app.get("/RecommendedWorker", authenticateToken, (req,res) => {
    res.render("LOCALS/RecommendedWorker")
})

app.get("/jobsPending", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/Joblist", {list: docs})
        }
    })
})

app.get("/OrderedList", authenticateToken, (req,res) => {
    console.log(req.body.name)
})

app.get("/EmployeeDB", authenticateToken, (req,res) => {hbs.registerHelper('cloudinaryUrl', (publicId, options) => {
    const format = options.hash.format || 'jpg';
    const url = cloudinary.url(publicId, { format: format });
    return url;
  });
    mongodb.getEmployee.find((err, docs) => {
        if(!err){
            res.render("LOCALS/AdminInterfaces/EmployeeDatabase", {list: docs})
            
        }
    })
})

app.get("/ClientDB", authenticateToken, (req,res) => {
    mongodb.getClient.find((err, docs) => {
        if(!err){
            res.render("LOCALS/AdminInterfaces/ClientDatabase", {list: docs})
        }
    })
})

app.get("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterfaces/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterfaces/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterfaces/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterfaces/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/interface", authenticateToken, (req, res) => {
    if(req.user.user === "Admin"){
        res.json({ success:true, user:req.user.user })
    } else if(req.user.user === "Employee"){
        res.json({ success:true, user:req.user.user })
    } else if(req.user.user === "Client"){
        res.json({ success:true, user:req.user.user })
    } else res.sendStatus(401)
})

app.get(":path", (req, res) => {
    url(req.params.path)
})

app.get("/interface/:user/:id",async (req, res) => {
    const check = await dataCheck.getData.getData(req.params.user, req.params.id)
    console.log(check)
    res.render("USERS/"+ req.params.user, {check})
})

app.get("/delete/:id/:user", (req, res) => {
    mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(req.params.id, (err) => {
        if(!err){
            res.redirect("/" + req.params.user + "DB")
        }
        else{ 
            console.log("Failed to Delete Details: " + err)
        }
    })
})

app.get("/accept/:id/:user", async (req, res) => {
    const id = (req.params.id)
    const user = (req.params.user + "s")
    const data1 = await mongodb.checkUsers.checkUsers(req.params.user).findById(id)
    mongodb.checkUsers.checkUsers(user).insertMany([data1],async (err) => {
        if(!err){
            await mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(id)
            res.redirect("/" + req.params.user + "DB")
        }
        else{
            res.send("May Mali")
        }
    })
})

// app.get("/accept/:id/:user",async (req, res) => {
//     const id = (req.params.id)
//     const data1 = await mongodb.getJobOrder.checkJob(id).findById(id)
//     mongodb.checkJobs.checkJob(id).insertMany([data1],async (err) => {
//         if(!err){
//             await mongodb.checkJobs.checkJob(id).findByIdAndRemove(id)
//             res.redirect("/" + req.params.user + "Database")
//         }
//         else{
//             res.send("May Mali")
//         }
//     })
// })


app.post("/save-review", authenticateToken, async (req,res) => {
    const review = req.body.review
})

app.post("/check-email", async (req, res) => {
        const email = req.body.email
        const eEmployee = await mongodb.getEmployee.findOne({ email })
        const eEmployees = await mongodb.getEmployees.findOne({ email })
        const eClient = await mongodb.getClient.findOne({ email })
        const eClients = await mongodb.getClients.findOne({ email })
        const user = eEmployee || eEmployees || eClient || eClients || undefined

        if(user === undefined){
            const exists = !!false
            res.json({ exists:exists })
        } else{
            const exists = !!true
            res.json({ exists:exists })
        }
})

app.post("/check-username", async (req, res) => {
    const username = req.body.username
    const uEmployee = await mongodb.getEmployee.findOne({ username })
    const uEmployees = await mongodb.getEmployees.findOne({ username })
    const uClient = await mongodb.getClient.findOne({ username })
    const uClients = await mongodb.getClients.findOne({ username })
    const user = uEmployee || uEmployees || uClient || uClients || undefined

    if(user === undefined){
        const exists = !!false
        res.json({ exists:exists })
    } else{
        const exists = !!true
        res.json({ exists:exists })
    }
})

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "resume")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

async function uploadImage(images){
    try{
        const avatar = await cloudinary.key.uploader.upload(images.avatar, {
            folder: "Avatar"
        }, (err) => {
            console.log(err)
        })
        const resume = await cloudinary.key.uploader.upload(images.resume, {
            folder: "Resume"
        }, (err) => {
            console.log(err)
        })
        
        const data2 = {
            avatar:avatar.secure_url,
            resume:resume.secure_url,
        }
        return data2
    } catch{
        res.sendStatus(500)
    }
}


app.post("/Signupexample", upload.fields([
    { name: "images", maxCounts: 1},
    { name: "image", maxCounts: 1}]),authenticateToken,
    async (req, res) => {
        const user = req.user.user;
        const userId = req.user._id;
        console.log(user);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            password: hashedPassword,
            name: req.body.name,
            username: req.body.username,
            contactnumber: req.body.contactNumber,
            email: req.body.email,
            address: (req.body.address1 + ", " + req.body.address2 + ", " + req.body.address3 + ", " + req.body.address4),
            zipcode: req.body.zipcode,
        };
        try{
            const images = {
                avatar:req.files["images"][0].path,
                resume:req.files["image"][0].path,
            }
            const data2 = await uploadImage(images)
            const data3 = Object.assign({}, data, data2)
            console.log("abot")
            if (user == "Client") {
                mongodb.getClients.findOneAndUpdate(userId, data3, (err, user) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.json({ success: true });
                    }
                });
            } else {
                mongodb.getEmployee.findOneAndUpdate(userId, { data3 });
                res.json({ success: true });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: "Server Error" });
        }
})

app.post("/signuppage", upload.fields([
    { name: "images", maxCounts: 1},
    { name: "image", maxCounts: 1}]),
    async (req, res) => {
        try{
            const data1 = await inputData(req.body)
            const images = {
                avatar:req.files["images"][0].path,
                resume:req.files["image"][0].path,
            }
            
            const data2 = await uploadImage(images)
            const data = Object.assign({}, data1, data2)

            mongodb.checkUsers.checkUsers(req.body.user).insertMany([data], (err) => {
                if(!err){
                    res.render("LOCALS/loginpage")
                } else {
                    console.error(err);
                    res.render("LOCALS/signuppage", { error: "An error occurred. Please try again." })
                }
            })
        } catch{
            res.render("LOCALS/signuppage", { error: "An error occurred. Please try again." })
        }
})


async function inputData(body){
    const securedPassword = 10
    const hashedPassword = await bcrypt.hash(body.password, securedPassword)
    
    if(body.user === "Client"){
        const data1 = {
            user:body.user,
            email:body.email,
            username:body.username,
            name:body.name,
            contactNumber:body.contactNumber,
            password:hashedPassword,
            address:(body.address1 + ", " + body.address2 + ", " + body.address3 + ", " + body.address4),
            birthday:body.birthday,
            zipcode:body.zipcode,
            gender:body.gender,
        } 
        return data1
    } else{
        const data1 = {
            user:body.user,
            jobType:body.job,
            email:body.email,
            username:body.username,
            name:body.name,
            contactNumber:body.contactNumber,
            password:hashedPassword,
            address:(body.address1 + ", " + body.address2 + ", " + body.address3 + ", " + body.address4),
            birthday:body.birthday,
            zipcode:body.zipcode,
            gender:body.gender,
        } 
        return data1
    }
}


// app.post("/check-data", authenticateToken, async (req, res) => {
//     const input = {
//         name:req.body.name,
//         password:req.body.password
//     }

//     const adm = await dataCheck.adminData.adminData(req.body.name)
//     const emp = await dataCheck.employeeData.employeeData(req.body.name)
//     const cli = await dataCheck.clientData.clientData(req.body.name)
//     const user = adm || emp || cli || undefined

//     if(input.name === "" && input.password === ""){
//         const error = "Please enter your Username/Email and Password."
//         const validity = !!true
        
//         res.json({error:error, validity:validity})
//     } else if(input.name !== null && input.password === ""){
//         const error = "Please enter your Password."
        
//     } else if(input.name === "" && input.password !== null){
//         const error = "Please enter your Username/Password."
  
//     } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
//         const error = "Invalid Account."
        
//     } else if((user.username === req.body.name || user.email === req.body.name) && user.password === req.body.password){ 
//         const validity = !!false
//         console.log(validity)
//         res.json({validity})
//     } else{
//         const error = ("Wrong Email/Username or Password!")
        
//     }
// })

app.post("/loginpage",async (req, res) => {
    const input = {
        name:req.body.name,
        password:req.body.password
    }

    const secret_key = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10"

    const adm = await dataCheck.adminData.adminData(req.body.name)
    const emp = await dataCheck.employeeData.employeeData(req.body.name)
    const cli = await dataCheck.clientData.clientData(req.body.name)
    const user = adm || emp || cli || undefined
    
    if(input.name === "" && input.password === ""){
        const error = "Please enter your Username/Email and Password."
        res.json({error:error, success:false})
    } else if(input.name !== null && input.password === ""){
        const error = "Please enter your Password."
        res.json({error:error, success:false})
    } else if(input.name === "" && input.password !== null){
        const error = "Please enter your Username/Password."
        res.json({error:error, success:false})
    } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
        const error = "Invalid Account."
        res.json({error:error, success:false})
    } else if((user.username === req.body.name || user.email === req.body.name) && (await bcrypt.compare(input.password, user.password) ||  user.password === req.body.password )){ 
        const tokenAccess = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1h"})
        const tokenRefresh = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1d"})
        res.cookie("jwt_s1", tokenAccess, {  })
        res.cookie("jwt_s2", tokenRefresh, { })
        res.json({success:true})
    } else{
        const error = ("Wrong Email/Username or Password!")
        res.json({error:error, success:false})
    }
})

async function authenticateToken(req, res, next) {
    const accessToken = req.cookies.jwt_s1;
    const refreshToken = req.cookies.jwt_s2;
    const secretKey = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10";
  
    try {
      const decoded = jwt.verify(accessToken, secretKey)
      const userId = decoded.userId
      const user = await getUser(userId)
  
      req.user = user
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, secretKey)
          const userId = decoded.userId
          const user = await getUser(userId)
  
          const newAccessToken = jwt.sign({ userId }, secretKey, { expiresIn: '15m' })
  
          res.cookie('jwt_s1', newAccessToken, {})
  
          req.user = user;
          next()
        } catch (err) {
          res.status(401).send({ success: false, message: "Invalid Token" })
        }
      } else {
        res.status(401).send({ success: false, message: "Invalid Token" })
      }
    }
}
  
async function getUser(userId) {
    const adm = await mongodb.getAdmin.findOne({ _id: userId });
    const emp = await mongodb.getEmployees.findOne({ _id: userId });
    const cli = await mongodb.getClients.findOne({ _id: userId });
    return adm || emp || cli || undefined;
}







app.post('/recommendation', (req, res) => {
    const recommendValue = req.body.optimalWorker
    const projectLocation = req.body.projectLocation
  
    console.log('Data received from client: ', { recommend: recommendValue, projectLocation: projectLocation })
  
    const python_process = spawn('python', ['HTML/models/RecommendEngineV2.py', recommendValue, projectLocation]);
    let matched_profiles = ''

    python_process.stdout.on('data', (data) => {
      matched_profiles = data.toString().trim()
    });
  
    python_process.stderr.on('data', (data) => {
      console.error(`Error from command: ${data}`)
    });
  
    python_process.on('close', () => {
      if (matched_profiles) {
        res.write(matched_profiles + '\n')
      } else {
        console.log('No matches found')
      }
  
      res.end()
    })
})

const port = 3000;
app.listen(port, () => {
    console.log("Port is Connected: " + port)
})