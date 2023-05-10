window.onload = () => {
  uploadPhotos();
  usersLogout();
};

function updateUI(result) {
  console.log("updateUI-result", result);
  // Filter result to below classes
  const classes = [
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
  ];
  const filtered = result.filter((item) => classes.includes(item));
  console.log(filtered);

  // Dictionary of animal classes
  const animalDict = {
    bird: "家禽或鳥類",
    cat: "貓",
    dog: "狗",
    horse: "馬",
    sheep: "羊",
    cow: "牛",
    elephant: "大象",
    bear: "熊",
    zebra: "斑馬",
    giraffe: "長頸鹿",
  };

  let animalArr = [];
  for (i = 0; i < filtered.length; i++) {
    animalArr.push(animalDict[filtered[i]]);
  }

  // Count how many animals
  const counts = {};
  const sampleArray = animalArr;
  sampleArray.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  console.log("counts", counts);

  // Transfer animal array to eg.(羊 X 1 ) format
  const animalName = Object.keys(counts);
  console.log("animalName", animalName);
  const animalCount = Object.values(counts);
  console.log("animalCount", animalCount);

  let animalDetails = ``;
  if (Array.isArray(animalName)) {
    for (let i = 0; i < animalName.length; i++) {
      animalDetails += animalName[i] + " X " + animalCount[i] + " ";
    }
  } else {
    animalDetails += animalName + " X " + animalCount + " ";
  }
  console.log(animalDetails);
  document.querySelector(
    ".ai-result-div"
  ).innerHTML = `<div class="result-title">AI預測結果：
  <div class="animal-result">${animalDetails}</div></div>
  <div class="rate"><input type="radio" id="star5" name="rate" value="5" />
  <label for="star5" title="text">5 stars</label>
  <input type="radio" id="star4" name="rate" value="4" />
  <label for="star4" title="text">4 stars</label>
  <input type="radio" id="star3" name="rate" value="3" />
  <label for="star3" title="text">3 stars</label>
  <input type="radio" id="star2" name="rate" value="2" />
  <label for="star2" title="text">2 stars</label>
  <input type="radio" id="star1" name="rate" value="1" />
  <label for="star1" title="text">1 star</label></div>`;

  // Count if animals amount is > 5
  let total = 0;
  for (const count of animalCount) {
    total += parseInt(count);
  }
  if (total > 5) {
    alert("Too many animals la...");
  }
}

async function uploadPhotos() {
  let input = document.getElementById("image");
  let imageName = document.getElementById("imageName");

  input.addEventListener("change", () => {
    let inputImage = [];
    let filesArr = document.querySelector("input[type=file]").files;
    for (i = 0; i < filesArr.length; i++) {
      inputImage.push(filesArr[i]);
    }
    console.log("inputImage", inputImage);

    // let imageNameStr = ''
    for (i = 0; i < inputImage.length; i++) {
      imageName.innerHTML += `${inputImage[i].name}</br>`;
    }

  });
  const form = document.querySelector("#upload-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const image = form.image.files[0];

    const formData = new FormData();
    formData.append("image", image);

    const resp = await fetch("/users/uploads", {
      method: "POST",
      body: formData,
    });
    const result = await resp.json();
    if (resp.status === 200) {
      alert("成功上載！");
      console.log(`result: ${result}`);
      console.log("type of", result);
      updateUI(result);
      // showResults()
    }
  });
}

async function usersLogout() {
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`/logout/users`);
    if (resp.status === 200) {
      window.location = "/private/usersPrivate/usersLogin.html";
    } else {
      const data = await resp.json();
      alert(data.message);
    }
  });
}