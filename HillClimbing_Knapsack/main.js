window.addEventListener("load", function () {
  // xử lý đầu vào
  const inputName = document.getElementById("nameObject");
  const inputWeight = document.getElementById("weightObject");
  const inputValue = document.getElementById("valueObject");
  const inputDataBalo = document.getElementById("valueDataBalo");
  inputWeight.addEventListener("input", function () {
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.replace(/\.$/, "");
    }
  });
  // inputValue.addEventListener("input", TypeNumberInput);
  // function TypeNumberInput() {
  //   this.value = this.value.replace(/[^0-9.]/g, ""); // gán những kí tự khác số = ""
  //   // Đảm bảo chỉ có một dấu chấm thập phân
  //   if ((this.value.match(/\./g) || []).length > 1) {
  //     this.value = this.value.replace(/\.$/, "");
  //   }
  // }

  function CheckDot(valueNumber) {
    return valueNumber.replace(/\./g, "");
  }

  let listObj = [];
  let baloWeight = 0.0;
  let index = 0;
  inputDataBalo.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9.]/g, "");
    if (this.value !== "") {
      baloWeight = parseFloat(this.value);
    }
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.replace(/\.$/, "");
    }
  });

  const listItem = document.querySelector(".listItemBalo");
  class Object {
    constructor(id, name, weight, value) {
      this.id = id;
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

  // xử lý xóa cả bảng
  const btnClearTable = document.getElementById("btnDeleteTable");
  btnClearTable.addEventListener("click", function () {
    listObj.splice(0, listObj.length);
    listItem.innerHTML = "";
    index = 0;
  });

  btnSave.addEventListener("click", handleSaveItem);
  function handleSaveItem() {
    const item = new Object(index + 1, inputName.value, inputWeight.value, inputValue.value);
    listObj.push(item);
    console.log(listObj);
    clearValue();
    addItemToList(item);
    index++;
    return listObj;
  }

  function addItemToList(item) {
    const btnDeleteWrapper = document.createElement("div");
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "-";
    btnDelete.classList.add("btnDeleteItem");
    btnDeleteWrapper.appendChild(btnDelete);
    btnDeleteWrapper.classList.add("itemObj3");

    const itemElement = document.createElement("div");
    const itemElementId = document.createElement("div");
    const itemElementName = document.createElement("div");
    const itemElementWeight = document.createElement("div");
    const itemElementValue = document.createElement("div");
    itemElement.classList.add("item");
    itemElementName.classList.add("itemObj");
    itemElementWeight.classList.add("itemObj");
    itemElementValue.classList.add("itemObj");
    itemElementId.classList.add("itemObj3");
    itemElementId.classList.add("check");
    itemElementName.textContent = item.name;
    itemElementWeight.textContent = item.weight;
    itemElementValue.textContent = item.value;
    itemElementId.textContent = item.id;

    if (item.name === "" || item.weight === "" || item.value === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");
    } else {
      itemElement.appendChild(itemElementId);
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      itemElement.appendChild(btnDeleteWrapper);
      listItem.appendChild(itemElement);
    }

    btnDelete.addEventListener("click", function () {
      itemElement.remove();
      const findItem = listObj.findIndex((arr) => arr.id === item.id);
      if (findItem !== -1) {
        listObj.splice(findItem, 1);
      }
      // In mảng sau khi đã cập nhật
      console.log("Cập nhật listObj: ", listObj);
    });
  }

  function hillClimbing(list, maxWeight) {
    let currentList = []; // danh sách đồ vật
    let remainingList = []; // danh sách đồ vật còn lại
    let currentWeight = 0;
    let currentValue = 0;

    // sắp xếp chọn đồ vật có tỉ lệ giá trị / trọng lượng lớn nhất bỏ vào
    // tạo 1 giải pháp trước
    list.sort((a, b) => CheckDot(b.value) / b.weight - CheckDot(a.value) / a.weight);

    list.forEach((item) => {
      if (currentWeight + parseFloat(item.weight) <= parseFloat(maxWeight)) {
        currentList.push(item);
        currentValue = currentValue + parseFloat(CheckDot(item.value));
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
        let currentValueNew = currentValue - parseFloat(CheckDot(currentItem.value));
        for (let j = 0; j < remainingList.length; j++) {
          let newItem = remainingList[j];
          if (
            parseFloat(newItem.weight) + currentWeightNew <= parseFloat(maxWeight) &&
            currentValue < currentValueNew + parseFloat(CheckDot(newItem.value))
          ) {
            currentList[i] = newItem;
            currentValue = currentValueNew + parseFloat(CheckDot(newItem.value));
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
    // console.log(currentValue);
    // console.log("danh sách duoc chon: ", currentList);
    // console.log("danh sach còn lại", remainingList);
    return { currentList, remainingList };
  }

  const btnRun = document.getElementById("runHillClimbing");
  btnRun.addEventListener("click", function () {
    const result = hillClimbing(listObj, baloWeight).currentList;
    const resultRemaining = hillClimbing(listObj, baloWeight).remainingList;
    if (listObj.length === 0) {
      alert("Danh sách đồ vật hiện đang rỗng!");
    }

    if (baloWeight === 0) {
      alert("Trọng lượng balo đang rỗng");
    }

    if (baloWeight !== 0 && listObj.length !== 0) {
      resultTable(result, resultRemaining);
    }
  });

  function resultTable(listRes, listRemaining) {
    const tableResult = document.querySelector(".resultTable");
    const tableRemaining = document.querySelector(".remainingTable");
    tableResult.innerHTML = "";
    tableRemaining.innerHTML = "";

    btnClearTable.addEventListener("click", function () {
      tableResult.innerHTML = "";
      tableRemaining.innerHTML = "";
      [...descTable].forEach((item) => {
        item.classList.add("hidden");
        item.classList.remove("visible");
      });
      [...resultTitle].forEach((item) => item.classList.add("hidden"));
    });

    const resultTitle = document.querySelectorAll(".titleResult");
    const descTable = document.querySelectorAll(".descTable");
    [...resultTitle].forEach((item) => item.classList.remove("hidden"));
    [...descTable].forEach((item) => {
      item.classList.remove("hidden");
      item.classList.add("visible");
    });

    listRes.forEach((item) => {
      const itemElement = document.createElement("div");
      const itemElementId = document.createElement("div");
      const itemElementName = document.createElement("div");
      const itemElementWeight = document.createElement("div");
      const itemElementValue = document.createElement("div");
      itemElement.classList.add("item");
      itemElementId.classList.add("itemObj2");
      itemElementName.classList.add("itemObj2");
      itemElementWeight.classList.add("itemObj2");
      itemElementValue.classList.add("itemObj2");
      itemElementId.textContent = item.id;
      itemElementName.textContent = item.name;
      itemElementWeight.textContent = item.weight;
      itemElementValue.textContent = item.value;
      itemElement.appendChild(itemElementId);
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      tableResult.appendChild(itemElement);
    });

    listRemaining.forEach((item) => {
      const itemElement = document.createElement("div");
      const itemElementId = document.createElement("div");
      const itemElementName = document.createElement("div");
      const itemElementWeight = document.createElement("div");
      const itemElementValue = document.createElement("div");
      itemElement.classList.add("item");
      itemElementId.classList.add("itemObj2");
      itemElementName.classList.add("itemObj2");
      itemElementWeight.classList.add("itemObj2");
      itemElementValue.classList.add("itemObj2");
      itemElementId.textContent = item.id;
      itemElementName.textContent = item.name;
      itemElementWeight.textContent = item.weight;
      itemElementValue.textContent = item.value;
      itemElement.appendChild(itemElementId);
      itemElement.appendChild(itemElementName);
      itemElement.appendChild(itemElementWeight);
      itemElement.appendChild(itemElementValue);
      tableRemaining.appendChild(itemElement);
    });
  }
});
