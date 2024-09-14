window.addEventListener("load", function () {
  // xử lý đầu vào
  const inputName = document.getElementById("nameObject");
  const inputWeight = document.getElementById("weightObject");
  const inputValue = document.getElementById("valueObject");
  const inputDataBalo = document.getElementById("valueDataBalo");
  inputWeight.addEventListener("input", TypeNumberInput);
  inputValue.addEventListener("input", TypeNumberInput);

  function TypeNumberInput() {
    this.value = this.value.replace(/\D/g, ""); // gán những kí tự khác số = ""
  }

  let listObj = [];
  let baloWeight = 0;
  inputDataBalo.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
    if (this.value !== "") {
      baloWeight = parseInt(this.value);
    }
  });

  const listItem = document.querySelector(".listItemBalo");
  class Object {
    constructor(name, weight, value) {
      this.name = name;
      this.weight = weight;
      this.value = value;
    }
  }

  // xử lý xóa obj
  const btnDelete = document.getElementById("btnDelete");
  const btnSave = document.getElementById("btnSave");
  btnDelete.addEventListener("click", clearValue);
  function clearValue() {
    inputValue.value = "";
    inputWeight.value = "";
    inputName.value = "";
  }

  btnSave.addEventListener("click", handleSaveItem);

  function handleSaveItem() {
    const item = new Object(inputName.value, inputWeight.value, inputValue.value);
    listObj.push(item);
    console.log(listObj);
    clearValue();
    addItemToList(item);
    return listObj;
  }

  function addItemToList(item) {
    const itemElement = document.createElement("div");
    const itemElementName = document.createElement("div");
    const itemElementWeight = document.createElement("div");
    const itemElementValue = document.createElement("div");
    itemElement.classList.add("item");
    itemElementName.classList.add("itemObj");
    itemElementWeight.classList.add("itemObj");
    itemElementValue.classList.add("itemObj");
    itemElementName.textContent = item.name;
    itemElementWeight.textContent = item.weight;
    itemElementValue.textContent = item.value;
    itemElement.appendChild(itemElementName);
    itemElement.appendChild(itemElementWeight);
    itemElement.appendChild(itemElementValue);
    listItem.appendChild(itemElement);
  }

  function hillClimbing(list, maxWeight) {
    let currentList = []; // danh sách đồ vật
    let remainingList = []; // danh sách đồ vật còn lại
    let currentWeight = 0;
    let currentValue = 0;

    // sắp xếp chọn đồ vật có tỉ lệ giá trị / trọng lượng lớn nhất bỏ vào
    // tạo 1 giải pháp trước
    list.sort((a, b) => b.value / b.weight - a.value / a.weight);

    list.forEach((item) => {
      if (currentWeight + parseFloat(item.weight) <= parseFloat(maxWeight)) {
        currentList.push(item);
        currentValue = currentValue + parseFloat(item.value);
        currentWeight = currentWeight + parseFloat(item.weight);
      } else {
        remainingList.push(item); // lưu các đồ vật còn lại
      }
    });

    let improved = true;
    while (improved) {
      // cải thiện hillClimbing
      improved = false;
      for (let i = 0; i < currentList.length; i++) {
        let currentItem = currentList[i];
        let currentWeightNew = currentWeight - parseFloat(currentItem.weight);
        let currentValueNew = currentValue - parseFloat(currentItem.value);
        for (let j = 0; j < remainingList.length; j++) {
          let newItem = remainingList[j];
          if (
            parseFloat(newItem.weight) + currentWeightNew <= parseFloat(maxWeight) &&
            currentValue < currentValueNew + parseFloat(newItem.value)
          ) {
            currentList[i] = newItem;
            currentValue = currentValueNew + parseFloat(newItem.value);
            currentWeight = currentWeightNew + parseFloat(newItem.weight);

            remainingList.splice(j, 1); // xóa phần tử ra khỏi ds còn lại
            remainingList.push(currentItem);
            improved = true;
            currentItem = newItem;
            break;
          }
        }
      }

      if (improved) {
        break;
      }
    }

    // trả về danh sách tối ưu
    console.log(currentValue);
    console.log("danh sách duoc chon: ", currentList);
    console.log("danh sach còn lại", remainingList);
    return { currentList, remainingList };
  }

  const btnRun = document.getElementById("runHillClimbing");
  btnRun.addEventListener("click", function () {
    const result = hillClimbing(listObj, baloWeight).currentList;
    const resultRemaining = hillClimbing(listObj, baloWeight).remainingList;
    resultTable(result, resultRemaining);
    if (listObj.length === 0) {
      alert("Danh sách đồ vật hiện đang rỗng!");
    }

    if (baloWeight === 0) {
      alert("Trọng lượng balo đang rỗng");
    }
    console.log("các đồ vật tối ưu được chọn: ", result);
  });

  function createTableUIVirtual() {
    if (listObj.length === 0) {
      const itemElement = document.createElement("div");
      const itemElementName = document.createElement("div");
      const itemElementWeight = document.createElement("div");
      const itemElementValue = document.createElement("div");
      itemElement.classList.add("item");
      itemElementName.classList.add("itemObj");
      itemElementWeight.classList.add("itemObj");
      itemElementValue.classList.add("itemObj");
      itemElementName.textContent = "...";
      itemElementWeight.textContent = "...";
      itemElementValue.textContent = "...";
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      listItem.appendChild(itemElement);
    } else {
    }
  }

  // createTableUIVirtual();

  function resultTable(listRes, listRemaining) {
    const tableResult = document.querySelector(".resultTable");
    const tableRemaining = document.querySelector(".remainingTable");
    const resultTitle = document.querySelectorAll(".titleResult");
    const descTable = document.querySelectorAll(".descTable");
    [...resultTitle].forEach((item) => item.classList.remove("hidden"));
    [...descTable].forEach((item) => {
      item.classList.remove("hidden");
      item.classList.add("visible");
    });

    listRes.forEach((item) => {
      const itemElement = document.createElement("div");
      const itemElementName = document.createElement("div");
      const itemElementWeight = document.createElement("div");
      const itemElementValue = document.createElement("div");
      itemElement.classList.add("item");
      itemElementName.classList.add("itemObj2");
      itemElementWeight.classList.add("itemObj2");
      itemElementValue.classList.add("itemObj2");
      itemElementName.textContent = item.name;
      itemElementWeight.textContent = item.weight;
      itemElementValue.textContent = item.value;
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      tableResult.appendChild(itemElement);
    });

    listRemaining.forEach((item) => {
      const itemElement = document.createElement("div");
      const itemElementName = document.createElement("div");
      const itemElementWeight = document.createElement("div");
      const itemElementValue = document.createElement("div");
      itemElement.classList.add("item");
      itemElementName.classList.add("itemObj2");
      itemElementWeight.classList.add("itemObj2");
      itemElementValue.classList.add("itemObj2");
      itemElementName.textContent = item.name;
      itemElementWeight.textContent = item.weight;
      itemElementValue.textContent = item.value;
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      tableRemaining.appendChild(itemElement);
    });
  }
});
