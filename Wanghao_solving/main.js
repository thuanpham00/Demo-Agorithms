function phuDinh(menhDe) {
  return menhDe.startsWith("~") ? menhDe.slice(1) : `~${menhDe}`;
}

function hoi(menhDe1, menhDe2) {
  return `(${menhDe1} ^ ${menhDe2})`;
}

function tuyen(menhDe1, menhDe2) {
  return `(${menhDe1} v ${menhDe2})`;
}

function suyLuan(menhDe1, menhDe2) {
  return `(${menhDe1} => ${menhDe2})`;
}

function tuongDuong(menhDe1, menhDe2) {
  return `(${menhDe1} <=> ${menhDe2})`;
}

document.getElementById("proveBtn").addEventListener("click", () => {
  const hypotheses = document
    .getElementById("hypotheses")
    .value.split(",")
    .map((h) => h.trim());
  const conclusion = document.getElementById("conclusion").value.trim();

  const resultElement = document.getElementById("result");
  resultElement.textContent = ""; // Xóa kết quả trước đó

  // Gọi hàm chứng minh mệnh đề
  chungMinhMenhDe(hypotheses, conclusion, resultElement);
});

function ktraMdDon(menhDe) {
  const phepToanLogic = ["v", "^", "=>", "<=>"];
  return !phepToanLogic.some((toanTu) => menhDe.includes(toanTu));
}

function chungMinhMenhDe(hypotheses, conclusion, resultElement) {
  const steps = []; // Biến để lưu trữ các bước
  hypotheses.map((h) => [h.split(" => ")[0], h.split(" => ")[1]]);

  const check = quyTac(hypotheses, [conclusion], 0, steps);
  inKetQua(steps, resultElement, hypotheses, conclusion); // Gọi hàm in kết quả
  if (check) {
    resultElement.innerHTML += `<p style="font-weight: 700; color: red">Kết quả: Mệnh đề đã cho là đúng.</p>`;
  } else {
    resultElement.innerHTML += `<p style="font-weight: 700; color: red">Kết quả: Mệnh đề đã cho là sai.</p>`;
  }
}

function inKetQua(steps, resultElement, hypotheses, conclusion) {
  resultElement.innerHTML += `<span style="font-weight: 700; color: red">Mệnh đề: ${hypotheses} --> ${conclusion}</span>`;
  resultElement.innerHTML += steps.join("");
}

// Áp dụng các quy tắc của thuật toán Vương Hạo
function quyTac(L, R, doSau, steps) {
  const indent = "&nbsp;".repeat(doSau * 3); // Tạo độ lùi cho mỗi nhánh con
  // Đảm bảo R là một mảng
  if (!Array.isArray(R)) {
    R = [R]; // Nếu R không phải là mảng, chuyển đổi nó thành mảng
  }

  // Di chuyển phủ định từ vế trái sang vế phải (Quy tắc 1L)
  for (let item of L) {
    if (item.startsWith("~") && ktraMdDon(item)) {
      const L_moi = L.filter((i) => i !== item);
      const R_moi = [item.slice(1), ...R];
      steps.push(
        `<span class="step">${indent}Quy tắc 1L: ${L_moi.filter(Boolean).join(", ")} --> ${R_moi.filter(Boolean).join(
          ", "
        )}</span>`
      );
      return quyTac(L_moi, R_moi, doSau, steps);
    }
  }

  // Di chuyển phủ định từ vế phải sang vế trái (Quy tắc 1R)
  for (let item of R) {
    if (item.startsWith("~") && ktraMdDon(item)) {
      const R_moi = R.filter((i) => i !== item);
      const L_moi = [item.slice(1), ...L];
      steps.push(`<span class="step">${indent}Quy tắc 1R: ${L_moi} --> ${R_moi}</span>`);
      return quyTac(L_moi, R_moi, doSau, steps);
    }
  }

  // Thay phép hội ở vế trái (Quy tắc 2)
  for (let item of L) {
    if (item.includes("^")) {
      const L_moi = [...L.filter((i) => i !== item), ...item.split(" ^ ")];
      steps.push(`<span class="step">${indent}Quy tắc 2: ${L_moi} --> ${R}</span>`);
      return quyTac(L_moi, R, doSau, steps);
    }
  }

  // Thay phép tuyển ở vế phải (Quy tắc 3)
  for (let item of R) {
    if (item.includes("v")) {
      const R_moi = [...R.filter((i) => i !== item), ...item.split(" v ")];
      steps.push(`<span class="step">${indent}Quy tắc 3: ${L} --> ${R_moi}</span>`);
      return quyTac(L, R_moi, doSau, steps);
    }
  }

  // Phân nhánh tuyển ở vế trái (Quy tắc 4)
  for (let item of L) {
    if (item.includes("v")) {
      const L_moi = L.filter((i) => i !== item);
      const nhanhA = [item.split(" v ")[0], ...L_moi];
      const nhanhB = [item.split(" v ")[1], ...L_moi];

      steps.push(`<span class="step">${indent}Quy tắc 4a (nhánh a${doSau}): ${nhanhA} --> ${R}</span>`);
      const ketQuaA = quyTac(nhanhA, R, doSau + 1, steps);
      steps.push(`<span class="step">${indent}|---> ${ketQuaA}</span>`);

      steps.push(`<span class="step">${indent}Quy tắc 4b (nhánh b${doSau}): ${nhanhB} --> ${R}</span>`);
      const ketQuaB = quyTac(nhanhB, R, doSau + 1, steps);
      steps.push(`<span class="step">${indent}|---> ${ketQuaB}</span>`);

      return ketQuaA && ketQuaB;
    }
  }

  // Phân nhánh hội ở vế phải (Quy tắc 5)
  for (let item of R) {
    if (item.includes("^")) {
      const R_moi = R.filter((i) => i !== item);
      const nhanhA = [item.split(" ^ ")[0], ...R_moi];
      const nhanhB = [item.split(" ^ ")[1], ...R_moi];

      steps.push(`<span class="step">${indent}Quy tắc 5a (nhánh a${doSau}): ${L} --> ${nhanhA}</span>`);
      const ketQuaA = quyTac(L, nhanhA, doSau + 1, steps);
      steps.push(`<span class="step">${indent}------> ${ketQuaA}</span>`);

      steps.push(`<span class="step">${indent}Quy tắc 5b (nhánh b${doSau}): ${L} --> ${nhanhB}</span>`);
      const ketQuaB = quyTac(L, nhanhB, doSau + 1, steps);
      steps.push(`<span class="step">${indent}------> ${ketQuaB}</span>`);

      return ketQuaA && ketQuaB;
    }
  }

  // Thay phép suy luận ở vế trái (Quy tắc 6L)
  for (let item of L) {
    if (item.includes("=>")) {
      const [X, Y] = item.split(" => ");
      const newMenhDe = phuDinh(X) + " v " + Y;
      const L_moi = [...L.filter((i) => i !== item), newMenhDe];
      steps.push(`<span class="step">${indent}Quy tắc 6L: ${L_moi} --> ${R}</span>`);
      return quyTac(L_moi, R, doSau, steps);
    }
  }

  // Thay phép suy luận ở vế phải (Quy tắc 6R)
  for (let item of R) {
    if (item.includes("=>")) {
      const [X, Y] = item.split(" => ");
      const R_moi = [...R.filter((i) => i !== item), phuDinh(X), Y];
      steps.push(`<span class="step">${indent}Quy tắc 6R: ${L} --> ${R_moi}</span>`);
      return quyTac(L, R_moi, doSau, steps);
    }
  }

  // Kiểm tra có mệnh đề giống nhau ở hai vế (bước cuối cùng)
  for (let item of L) {
    if (R.includes(item)) {
      steps.push(
        `<span class="step">${indent}Kiểm tra tương đương: ${L.filter(Boolean).join(", ")} --> ${R.filter(Boolean).join(
          ", "
        )}</span>`
      );
      return true;
    }
  }
  return false;
}

