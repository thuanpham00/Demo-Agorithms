window.addEventListener("load", function () {
  // xử lý đầu vào
  const inputName = document.getElementById("nameObject");
  const inputWeight = document.getElementById("weightObject");
  const inputValue = document.getElementById("valueObject");
  const inputDataBalo = document.getElementById("valueDataBalo");

  // xử lý chỉ nhập được 1 kí tự "."
  inputWeight.addEventListener("input", function () {
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.replace(/\.$/, "");
    }
  });

  // xử lý thay kí tự "." thành ""
  function CheckDot(valueNumber) {
    return valueNumber.replace(/\./g, "");
  }

  let listObj = [];
  let baloWeight = 0.0;
  let index = 0;

  // xử lý ràng buộc trọng lượng balo
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

  // xử lý xóa 1 item
  const btnDelete = document.getElementById("btnDelete");
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

  // xử lý lưu item vào mảng
  const btnSave = document.getElementById("btnSave");
  btnSave.addEventListener("click", handleSaveItem);
  function handleSaveItem() {
    const itemName = inputName.value.trim();
    const itemWeight = inputWeight.value.trim();
    const itemValue = inputValue.value.trim();

    if (itemName === "" || itemWeight === "" || itemValue === "") {
      alert("Vui lòng nhập đầy đủ thông tin trước khi lưu");
      return;
    }

    const item = new Object(index + 1, itemName, itemWeight, itemValue);
    listObj.push(item);
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

    itemElement.appendChild(itemElementId);
    itemElement.appendChild(itemElementName);
    itemElement.appendChild(itemElementWeight);
    itemElement.appendChild(itemElementValue);
    itemElement.appendChild(btnDeleteWrapper);
    listItem.appendChild(itemElement);

    btnDelete.addEventListener("click", function () {
      // xóa item trên UI
      itemElement.remove();
      const findItem = listObj.findIndex((arr) => arr.id === item.id);
      if (findItem !== -1) {
        // xóa item trong list
        listObj.splice(findItem, 1);
      }
    });
  }

  function createListInitial(listInput, maxWeight) {
    let currentList = []; // danh sách đồ vật
    let remainingList = []; // danh sách đồ vật còn lại
    let currentWeight = 0;

    // sắp xếp chọn đồ vật có tỉ lệ giá trị / trọng lượng lớn nhất bỏ vào
    // tạo 1 giải pháp trước
    listInput.sort((a, b) => b.value / b.weight - a.value / a.weight);

    listInput.forEach((item) => {
      if (currentWeight + parseFloat(item.weight) <= parseFloat(maxWeight)) {
        currentList.push(item);
        currentWeight = currentWeight + parseFloat(item.weight);
      } else {
        remainingList.push(item); // lưu các đồ vật còn lại
      }
    });

    return { currentList, remainingList };
  }

  // tìm nghiệm lân cận
  function neighbor(currentList, remainingList, maxWeight) {
    let currentWeight = currentList.reduce((sum, item) => sum + parseFloat(CheckDot(item.weight)), 0);
    let bestList = [...currentList];
    let bestCost = Cost(currentList);

    // Thử thêm từng đồ vật từ remainingList
    remainingList.forEach((itemAdd) => {
      if (currentWeight + parseFloat(itemAdd.weight) <= maxWeight) {
        let newList = [...currentList, itemAdd];
        let newCost = Cost(newList);
        if (newCost > bestCost) {
          bestList = newList;
          bestCost = newCost;
        }
      }
    });

    // Thử loại bỏ từng đồ vật trong currentList
    currentList.forEach((itemRemove, index) => {
      let newList = [...currentList];
      newList.splice(index, 1); // Loại bỏ món đồ
      let newCost = Cost(newList);
      if (newCost > bestCost) {
        bestList = newList;
        bestCost = newCost;
      }
    });

    // Thử thay thế từng đồ vật trong currentList với từng đồ vật trong remainingList
    currentList.forEach((itemRemove, index) => {
      remainingList.forEach((itemAdd) => {
        let newWeight = currentWeight - parseFloat(itemRemove.weight) + parseFloat(itemAdd.weight);
        if (newWeight <= maxWeight) {
          let newList = [...currentList];
          newList[index] = itemAdd; // Thay thế món đồ
          let newCost = Cost(newList);
          if (newCost > bestCost) {
            bestList = newList;
            bestCost = newCost;
          }
        }
      });
    });

    return { currentList: bestList, remainingList };
  }

  function Cost(list) {
    return list.reduce((sum, item) => sum + parseFloat(CheckDot(item.value)), 0);
  }

  function acceptance_probability(costNew, costOld, temperature) {
    // giá trị cũ lớn hơn giá trị mới
    // chấp nhận nghiệm -> cập nhật list
    if (costNew >= costOld) {
      return 1;
    }
    return Math.exp(-(costNew - costOld) / temperature); // chấp nhận nghiệm kém hơn
    // vẫn chấp nhận nghiệm xấu // tính xác suất chấp nhận // loại bỏ mắc kẹt cục bộ ở đây
  }

  // cải thiện = thuật toán
  function simulatedAnnealing(listInput, maxWeight) {
    const { currentList, remainingList } = createListInitial(listInput, maxWeight);
    let currentList_1 = currentList.slice();
    let remainingList_1 = remainingList.slice();
    console.log(currentList_1);
    console.log(remainingList_1);

    let costOld = Cost(currentList_1);
    let T = 1.0;
    let T_min = 0.00001;
    let A_pha = 0.95;
    let maxNoImprovement = 200; // Giới hạn số lần không cải thiện
    let noImprovementCount = 0; // Đếm số lần không cải thiện
    let improved = true;

    while (T > T_min && noImprovementCount < maxNoImprovement) {
      improved = false;
      let i = 0;
      while (i < 5000) {
        let { currentList: newList, remainingList: newRemainingList } = neighbor(
          currentList_1,
          remainingList_1,
          maxWeight
        );
        if (newList.length > 0) {
          let costNew = Cost(newList);
          let ap = acceptance_probability(costNew, costOld, T);
          if (ap > Math.random()) {
            currentList_1 = newList;
            remainingList_1 = newRemainingList;
            costOld = costNew;
            improved = true;
          }
        }
        i++;
      }
      if (!improved) {
        noImprovementCount++; // Thoát nếu không cải thiện
      } else {
        noImprovementCount = 0;
      }
      T = T * A_pha;
    }

    // xử lý list còn lại
    remainingList_1 = listInput.filter(
      (item) => !currentList_1.some((currentItem) => currentItem.id === item.id)
    );
    return { currentList_1, remainingList_1 };
  }

  const btnRun = document.getElementById("runHillClimbing");
  btnRun.addEventListener("click", function () {
    const { currentList_1, remainingList_1 } = simulatedAnnealing(listObj, baloWeight);
    if (listObj.length === 0) {
      alert("Danh sách đồ vật hiện đang rỗng!");
    }

    if (baloWeight === 0) {
      alert("Trọng lượng balo đang rỗng");
    }

    if (baloWeight !== 0 && listObj.length !== 0) {
      resultTable(currentList_1, remainingList_1);
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
