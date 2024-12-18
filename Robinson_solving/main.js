window.addEventListener("load", function () {
  let activeInput = null;
  const inputHypotheses = document.getElementById("hypotheses");
  const inputConclusion = document.getElementById("conclusion");
  const btnDisjunction = document.getElementById("Disjunction");
  const btnConjunction = document.getElementById("Conjunction");
  const btnImplication = document.getElementById("Implication");
  const btnNegation = document.getElementById("Negation");
  const btnEquivalence = document.getElementById("Equivalence");

  inputHypotheses.addEventListener("input", validateInput);
  inputConclusion.addEventListener("input", validateInput);
  function validateInput() {
    this.value = this.value.replace(/\d/g, ""); // thay các kí tự số là ""
  }

  inputHypotheses.addEventListener("focus", function () {
    activeInput = inputHypotheses;
  });

  inputConclusion.addEventListener("focus", function () {
    activeInput = inputConclusion;
  });

  btnDisjunction.addEventListener("click", function () {
    if (activeInput) {
      activeInput.value += "∧";
    }
  });

  btnConjunction.addEventListener("click", function () {
    if (activeInput) {
      activeInput.value += "∨";
    }
  });

  btnImplication.addEventListener("click", function () {
    if (activeInput) {
      activeInput.value += "=>";
    }
  });

  btnNegation.addEventListener("click", function () {
    if (activeInput) {
      activeInput.value += "¬";
    }
  });

  btnEquivalence.addEventListener("click", function () {
    if (activeInput) {
      activeInput.value += "<=>";
    }
  });

  document.getElementById("inputForm").addEventListener("submit", function (e) {
    e.preventDefault(); // chặn form mặc định
    const steps = document.getElementById("steps");
    steps.innerHTML = "";

    // Tách giả thuyết
    const Hypotheses = inputHypotheses.value.split(", ").map((item) => item.trim());
    const Conclusion = inputConclusion.value.trim();

    function convertToCNF(hypotheses) {
      function eliminateImplications(expr) {
        return expr
          .replace(/(\w+)\s*=>\s*(\w+)/g, "¬$1 ∨ $2") //  A => C === ¬A ∨ C
          .replace(/(\(.+?\))\s*=>\s*(\w+)/g, "¬$1 ∨ $2") // (B ∧ C) => D === ¬(B ∧ C) ∨ D
          .replace(/(\w+)\s*=>\s*(\(.+?\))/g, "¬$1 ∨ $2"); // D => (B ∧ C) === ¬D ∨ (B ∧ C)
      }

      function eliminateBiconditionals(expr) {
        return expr
          .replace(/(\w+)\s*<=>\s*(\w+)/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)") // A <=> B === (A ∧ B) ∨ (¬A ∧ ¬B)
          .replace(/(\(.+?\))\s*<=>\s*(\w+)/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)") // (A ∧ B) <=> C === ((A ∧ B) ∧ C) ∨ (¬(A ∧ B) ∧ ¬C)
          .replace(/(\w+)\s*<=>\s*(\(.+?\))/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)") // A <=> (C ∨ D) === (A ∧ (C ∨ D)) ∨ (¬A ∧ ¬(C ∨ D))
          .replace(/(\(.+?\))\s*<=>\s*(\(.+?\))/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)"); // (A ∧ B) <=> (C ∨ D) === ((A ∧ B) ∧ (C ∨ D)) ∨ (¬(A ∧ B) ∧ ¬(C ∨ D))
      }

      function applyDeMorgan(expr) {
        // Áp dụng định luật De Morgan cho các biểu thức AND và OR
        expr = expr.replace(/¬\((¬(\w+))\s*∨\s*(¬(\w+))\)/g, "$1 ∧ $2"); // ¬(¬A ∨ ¬B) => A ∧ B
        expr = expr.replace(/¬\((\w+)\s*∧\s*(\w+)\)/g, "¬$1 ∨ ¬$2"); // ¬(A ∧ B) => ¬A ∨ ¬B
        expr = expr.replace(/¬\((\w+)\s*∨\s*(\w+)\)/g, "¬$1 ∧ ¬$2"); // ¬(A ∨ B) => ¬A ∧ ¬B
        expr = expr.replace(/¬\(¬(\w+)\)/g, "$1"); // ¬(¬A) => A
        return expr;
      }

      function formatAndOperator(expr) {
        // Thêm khoảng trắng xung quanh toán tử ∧ và ∨
        expr = expr.replace(/(\w+)\s*∧\s*(\w+)/g, "$1 ∧ $2");
        expr = expr.replace(/(\w+)\s*∨\s*(\w+)/g, "$1 ∨ $2");
        expr = expr.replace(/(¬\w+)\s*∨\s*(¬\w+)/g, "$1 ∨ $2"); // Thêm khoảng trắng cho trường hợp ¬u ∨ ¬s
        return expr;
      }

      function splitConjunctions(expr) {
        // Loại bỏ các dấu ngoặc không cần thiết
        expr = expr.replace(/^\(|\)$/g, "");

        // Tách các mệnh đề hội thành các phần tử riêng lẻ
        const elements = expr.split(/\s*∧\s*/);

        // Làm sạch các phần tử (loại bỏ khoảng trắng và dấu ngoặc)
        const cleanedElements = elements.map((element) =>
          element.trim().replace(/^\(/, "").replace(/\)$/, "")
        );

        // Trả về các phần tử đã được loại bỏ trùng lặp
        return [...new Set(cleanedElements)];
      }

      function normalizeExpression(expr) {
        // Loại bỏ các phần tử trùng lặp
        expr = expr.replace(/(\w+)\s*∧\s*\1/g, "$1"); // A ∧ A => A
        expr = expr.replace(/(\w+)\s*∨\s*\1/g, "$1"); // A ∨ A => A
        return expr;
      }

      function toCNF(expr) {
        expr = eliminateImplications(expr);
        expr = eliminateBiconditionals(expr);
        expr = applyDeMorgan(expr);
        expr = formatAndOperator(expr);
        expr = normalizeExpression(expr);

        // Thêm bước phân phối OR qua AND
        // expr = distributeOrOverAnd(expr);

        const conjunctions = splitConjunctions(expr);
        return conjunctions; // Trả về mảng chứa các mệnh đề CNF
      }

      return hypotheses.map((hypothesis) => toCNF(hypothesis.replace(/\s/g, ""))).flat(); // Sử dụng flat() để chuyển đổi mảng 2 chiều thành 1 chiều
    }

    function convertToCNF2(conclusion) {
      // Hàm phủ định kết luận
      function negate(expr) {
        // Nếu mệnh đề là phức tạp, sử dụng quy tắc De Morgan
        if (expr.includes("∧")) {
          // Phủ định mệnh đề AND: ¬(A ∧ B) => ¬A v ¬B
          return expr.replace(/(\w+)\s*∧\s*(\w+)/g, "¬$1 v ¬$2");
        } else if (expr.includes("v")) {
          // Phủ định mệnh đề OR: ¬(A v B) => ¬A ∧ ¬B
          return expr.replace(/(\w+)\s*v\s*(\w+)/g, "¬$1 ∧ ¬$2");
        }
        return `¬${expr}`; // Nếu không có mệnh đề phức tạp
      }

      // Hàm loại bỏ các hàm suy diễn
      function eliminateImplications(expr) {
        return expr
          .replace(/(\w+)\s*=>\s*(\w+)/g, "¬$1 ∨ $2") //  A => C === ¬A ∨ C
          .replace(/(\(.+?\))\s*=>\s*(\w+)/g, "¬$1 v $2")
          .replace(/(\w+)\s*=>\s*(\(.+?\))/g, "¬$1 v $2");
      }

      function eliminateBiconditionals(expr) {
        return expr
          .replace(/(\w+)\s*<=>\s*(\w+)/g, "($1 ∧ $2) v (¬$1 ∧ ¬$2)") // A <=> B === (A ∧ B) ∨ (¬A ∧ ¬B)
          .replace(/(\(.+?\))\s*<=>\s*(\w+)/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)") // (A ∧ B) <=> C === ((A ∧ B) ∧ C) ∨ (¬(A ∧ B) ∧ ¬C)
          .replace(/(\w+)\s*<=>\s*(\(.+?\))/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)") // A <=> (C ∨ D) === (A ∧ (C ∨ D)) ∨ (¬A ∧ ¬(C ∨ D))
          .replace(/(\(.+?\))\s*<=>\s*(\(.+?\))/g, "($1 ∧ $2) ∨ (¬$1 ∧ ¬$2)"); // (A ∧ B) <=> (C ∨ D) === ((A ∧ B) ∧ (C ∨ D)) ∨ (¬(A ∧ B) ∧ ¬(C ∨ D))
      }

      // Hàm áp dụng quy tắc De Morgan
      function applyDeMorgan(expr) {
        // Phủ định của AND: ¬(A ∧ B) → ¬A v ¬B
        expr = expr.replace(/¬\((\w+)\s*∧\s*(\w+)\)/g, "¬$1 v ¬$2");

        // Phủ định của OR: ¬(A v B) → ¬A ∧ ¬B
        expr = expr.replace(/¬\((\w+)\s*v\s*(\w+)\)/g, "¬$1 ∧ ¬$2");

        // Phủ định kép: ¬(¬A) → A
        expr = expr.replace(/¬\(¬(\w+)\)/g, "$1").replace(/¬¬(\w+)/g, "$1");

        // Phủ định tổ hợp phức tạp: ¬(¬A v ¬B) → A ∧ B
        expr = expr.replace(/¬\((¬\w+)\s*v\s*(¬\w+)\)/g, (match, p1, p2) => {
          const var1 = p1.slice(1); // Loại bỏ ¬
          const var2 = p2.slice(1); // Loại bỏ ¬
          return `(${var1} ∧ ${var2})`;
        });

        return expr;
      }

      // Hàm định dạng toán tử AND
      function formatAndOperator(expr) {
        expr = expr.replace(/(\w+)∧(\w+)/g, "$1 ∧ $2");
        return expr;
      }

      function simplifyDoubleNegation(expr) {
        // Loại bỏ tất cả các phủ định kép ¬(¬A) => A hoặc ¬¬A => A
        return expr.replace(/¬\(¬(\w+)\)/g, "$1").replace(/¬¬(\w+)/g, "$1");
      }

      function distributeAndOverOr(expr) {
        // Phân phối AND qua OR: (A ∧ B) v D → (A v D) ∧ (B v D)
        expr = expr.replace(/\((\w+)\s*∧\s*(\w+)\)\s*v\s*(\w+)/g, "($1 v $3) ∧ ($2 v $3)");

        // Tách thành các mệnh đề riêng biệt: (A v D) ∧ (B v D) => (A v D), (B v D)
        expr = expr.replace(/\((\w+)\s*v\s*(\w+)\)\s*∧\s*\((\w+)\s*v\s*(\w+)\)/g, "$1 v $2, $3 v $4");

        // Phân phối OR qua AND: A v (B ∧ C) → (A v B) ∧ (A v C)
        expr = expr.replace(/(\w+)\s*v\s*\((\w+)\s*∧\s*(\w+)\)/g, "($1 v $2) ∧ ($1 v $3)");

        // Xử lý tổ hợp phức tạp hơn: (A ∧ B) v (C ∧ D) → ((A v C) ∧ (A v D)) ∧ ((B v C) ∧ (B v D))
        expr = expr.replace(
          /\((\w+)\s*∧\s*(\w+)\)\s*v\s*\((\w+)\s*∧\s*(\w+)\)/g,
          "(($1 v $3) ∧ ($1 v $4)) ∧ (($2 v $3) ∧ ($2 v $4))"
        );

        return expr;
      }

      // Hàm chính để chuyển đổi sang CNF
      function toCNF(expr) {
        expr = expr
          .split(",")
          .map((e) => e.trim())
          .map(negate)
          .join(", ");
        expr = eliminateImplications(expr);
        expr = eliminateBiconditionals(expr);
        expr = applyDeMorgan(expr);
        expr = distributeAndOverOr(expr); // Thêm bước phân phối
        expr = simplifyDoubleNegation(expr); // Loại bỏ phủ định kép
        expr = formatAndOperator(expr);

        return expr;
      }

      return toCNF(conclusion).split(", ");
    }

    let convertHypothesesArray = convertToCNF(Hypotheses);
    steps.innerHTML += `<p><strong>Dạng chuẩn:</strong> ${convertHypothesesArray.join(
      ", "
    )}  => ${Conclusion}</p>`;
    let convertNegateConclusion = convertToCNF2(Conclusion);
    [...convertNegateConclusion].forEach((item) => convertHypothesesArray.push(item));

    function resolveClauses(clause1, clause2) {
      const normalizedClause1 = clause1.replace(/∨/g, " v ");
      const normalizedClause2 = clause2.replace(/∨/g, " v ");
      const literals1 = normalizedClause1.split(/\s*v\s*/).map((literal) => literal.trim());
      const literals2 = normalizedClause2.split(/\s*v\s*/).map((literal) => literal.trim());

      for (let literals1Item of literals1) {
        for (let literals2Item of literals2) {
          if (literals1Item === `¬${literals2Item}` || `¬${literals1Item}` === literals2Item) {
            const newClause = literals1
              .filter((lit) => lit !== literals1Item)
              .concat(literals2.filter((lit) => lit !== literals2Item))
              .filter((lit, index, self) => self.indexOf(lit) === index)
              .join(" v ");

            return newClause || "∅";
          }
        }
      }
      return null;
    }

    steps.innerHTML += `<p><strong>Danh sách các mệnh đề:</strong> ${convertHypothesesArray
      .map((item) => `<span style="display: block">${item}</span>`)
      .join("")}</p>`;

    steps.innerHTML += `<p><strong>Tuyển từng cặp mệnh đề từ các mệnh đề:</p>`;

    function checkContradictoryClauses(clauses) {
      // Chuyển các mệnh đề thành mảng các phần tử
      const normalizedClauses = clauses.map((clause) => clause.trim());

      // Biến lưu trữ các mệnh đề đã thấy
      const seen = new Set();

      for (const clause of normalizedClauses) {
        // Kiểm tra xem mệnh đề ngược có tồn tại không
        if (clause.startsWith("¬")) {
          const positiveClause = clause.slice(1); // Lấy phần mệnh đề không phủ định
          if (seen.has(positiveClause)) {
            return [positiveClause, clause]; // Trả về cặp mệnh đề đối ngẫu
          }
        } else {
          const negativeClause = `¬${clause}`; // Tạo mệnh đề phủ định
          seen.add(clause); // Lưu trữ mệnh đề đã thấy
          if (seen.has(negativeClause)) {
            return [clause, negativeClause]; // Trả về cặp mệnh đề đối ngẫu
          }
        }
      }

      return null; // Không tìm thấy cặp đối ngẫu
    }

    let newClauses = [...convertHypothesesArray];
    let previousClauses = new Set(newClauses); // Tập hợp lưu trữ các mệnh đề đã xử lý
    let iterationCount = 0; // Đếm số vòng lặp
    const maxIterations = 50; // Giới hạn số vòng lặp tối đa

    let foundEmptyClause = false;
    let foundContradictoryPair = false;
    while (!foundEmptyClause && !foundContradictoryPair) {
      const contradictoryPair = checkContradictoryClauses(newClauses);
      if (contradictoryPair) {
        steps.innerHTML += `<p><strong>Cặp mệnh đề đối ngẫu được tìm thấy: ${contradictoryPair[0]} và ${contradictoryPair[1]}</strong></p>`;
        steps.innerHTML += `<p><strong>Kết luận:</strong> Mệnh đề đã được chứng minh thành công.</p>`;
        foundContradictoryPair = true; // Đặt cờ khi tìm thấy cặp đối ngẫu
        return; // Dừng lại
      }

      let newGeneratedClauses = [];
      let emptyClauseFound = false;

      for (let i = 0; i < newClauses.length; i++) {
        for (let j = i + 1; j < newClauses.length; j++) {
          const resolvedClause = resolveClauses(newClauses[i], newClauses[j]);
          // console.log(resolvedClause);

          if (resolvedClause === "∅") {
            foundEmptyClause = true; // Đặt cờ tìm thấy mệnh đề rỗng
            emptyClauseFound = true;
            break; // Thoát ra khỏi cả hai vòng lặp for;
          } else if (resolvedClause && !newClauses.includes(resolvedClause)) {
            const sortResolvedClause = resolvedClause.split(" v ").sort().join(" v ");
            const exists = newGeneratedClauses.some((clause) => {
              const sortedClause = clause.split(" v ").sort().join(" v ");
              return sortedClause === sortResolvedClause;
            });

            if (!exists) {
              newGeneratedClauses.push(resolvedClause);
              steps.innerHTML += `<p>Hợp giải giữa <strong>${newClauses[i]}</strong> và <strong>${newClauses[j]}</strong> tạo ra: <strong>${resolvedClause}</strong></p>`;
              newGeneratedClauses.forEach((clause) => previousClauses.add(clause));
              newClauses = newClauses.concat(newGeneratedClauses);

              const check = checkContradictoryClauses(newClauses);
              if (Boolean(check)) {
                steps.innerHTML += `<p><strong>Cặp mệnh đề đối ngẫu được tìm thấy: ${check[0]} và ${check[1]}</strong></p>`;
                steps.innerHTML += `<p><strong>Kết luận:</strong> Mệnh đề đã được chứng minh thành công.</p>`;
                foundContradictoryPair = true; // Đặt cờ khi tìm thấy cặp đối ngẫu
                return; // Dừng lại
              }
            }
          }
        }
        if (emptyClauseFound) break; // Dừng vòng lặp i nếu đã tìm thấy mệnh đề rỗng
      }

      if (newGeneratedClauses.length === 0) {
        steps.innerHTML += `<p><strong>Kết luận:</strong> Không tìm thấy mệnh đề đối ngẫu. Không thể chứng minh mệnh đề.</p>`;
        break;
      }

      iterationCount++; // Tăng biến đếm số lần lặp
    }

    if (iterationCount >= maxIterations) {
      steps.innerHTML += `<p><strong>Kết luận:</strong> Thuật toán đã vượt quá giới hạn số vòng lặp (${maxIterations}). Không thể giải được mệnh đề.</p>`;
    }
  });
});

// p => q, q => r, r => s, p
// p ∧ s

// (A ∧ B) => C, (B ∧ C) => D, A ∧ B
// D

// p => q, q => r, r => s, p
// s

// (M ∧ N) => O, (N ∧ O) => P, M ∧ N
// O ∧ P

// M ∨ N, (M ∧ P) => Q, P
// Q

// ¬p ∨ q, ¬q ∨ r, ¬r ∨ s, ¬u ∨ ¬s
// ¬p, ¬u
