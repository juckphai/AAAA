
    function openSummaryModal(htmlContent) {
        const modal = document.getElementById('summaryModal');
        const modalBody = document.getElementById('modalBodyContent');
        modalBody.innerHTML = htmlContent;
        modal.style.display = 'flex';
        setupSummaryControlsAndSave(); // เรียกใช้ฟังก์ชันตั้งค่าปุ่มและแถบเลื่อน
    }

    function setupSummaryControlsAndSave() {
        const modalContentContainer = document.querySelector("#summaryModal .modal-content-container");
        const modalBody = document.getElementById("modalBodyContent");
        if (!modalBody || !modalContentContainer) return;

        // --- Font Size Controls ---
        const textElements = modalBody.querySelectorAll('p, h4, strong, th, td, span, div');
        const fsSlider = document.getElementById("summaryFontSizeSlider");
        const fsValueSpan = document.getElementById("summaryFontSizeValue");

        textElements.forEach(el => {
            if (!el.dataset.originalSize) {
                el.dataset.originalSize = parseFloat(window.getComputedStyle(el).fontSize);
            }
        });

        function updateFontSize() {
            const scale = fsSlider.value;
            textElements.forEach(el => {
                const originalSize = parseFloat(el.dataset.originalSize);
                if (originalSize) {
                    el.style.fontSize = (originalSize * scale) + 'px';
                }
            });
            fsValueSpan.textContent = "ขนาด: " + Math.round(scale * 100) + "%";
        }
        // Remove old listener before adding new one
        fsSlider.removeEventListener("input", updateFontSize);
        fsSlider.addEventListener("input", updateFontSize);

        // --- Line Height Controls ---
        const lhSlider = document.getElementById("summaryLineHeightSlider");
        const lhValueSpan = document.getElementById("summaryLineHeightValue");

        function updateLineHeight() {
            const lineHeight = lhSlider.value;
            modalBody.style.lineHeight = lineHeight;
            lhValueSpan.textContent = "ความสูงของบรรทัด: " + lineHeight;
        }
        // Remove old listener before adding new one
        lhSlider.removeEventListener("input", updateLineHeight);
        lhSlider.addEventListener("input", updateLineHeight);
        
        // --- Save as Image Button Logic ---
        const saveBtn = document.getElementById("saveSummaryAsImageBtn");
        // Clone and replace to remove old listeners
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

        newSaveBtn.addEventListener("click", function() {
            const controlsElement = modalContentContainer.querySelector('.modal-controls');
            
            // Temporarily hide controls for capture
            if (controlsElement) controlsElement.style.display = 'none';

            // --- START: ส่วนที่เพิ่มเข้ามา ---
            // ปรับ padding ด้านข้างให้เล็กลงชั่วคราวก่อนถ่ายภาพ
            // (15px คือ บน-ล่าง, 5px คือ ซ้าย-ขวา) คุณสามารถปรับเลข 5px ได้ตามต้องการ
            modalContentContainer.style.padding = '5px 2px';
            // --- END: ส่วนที่เพิ่มเข้ามา ---

            html2canvas(modalContentContainer, {
                useCORS: true,
                scale: 4, // Higher resolution
                backgroundColor: '#FAFAD2' // Match content background
            }).then(canvas => {
                const link = document.createElement('a');
                const fileName = `สรุป_${currentAccount || 'account'}_${Date.now()}.png`;
                link.download = fileName;
                link.href = canvas.toDataURL("image/png");
                link.click();
            }).catch(err => {
                console.error("Error creating image:", err);
                alert("ขออภัย, ไม่สามารถบันทึกเป็นรูปภาพได้");
            }).finally(() => {
                // Show controls again
                if (controlsElement) controlsElement.style.display = '';
                
                // --- START: ส่วนที่เพิ่มเข้ามา ---
                // ล้างค่า style ที่เราใส่เข้าไป เพื่อให้ padding กลับไปเป็นค่าเดิมจาก CSS
                modalContentContainer.style.padding = '';
                // --- END: ส่วนที่เพิ่มเข้ามา ---
            });
        });        
        // Initial setup
        updateFontSize();
        updateLineHeight();
    }
// === END: ฟังก์ชันที่ปรับปรุงและเพิ่มเข้ามาใหม่ ===

    function closeSummaryModal() { const modal = document.getElementById('summaryModal'); modal.style.display = 'none'; }
// === ฟังก์ชันสำหรับเมนูใหญ่ (แสดงครั้งละ 1 เมนู) ===
function toggleMainSection(sectionId) { 
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    
    // ตรวจสอบว่าเมนูนี้กำลังเปิดอยู่แล้วหรือไม่
    const isCurrentlyActive = section.classList.contains('active');
    
    // ซ่อนเมนูใหญ่ทั้งหมดก่อน
    const allMainSections = document.querySelectorAll('.main-section-content');
    const allMainHeaders = document.querySelectorAll('.main-section-header');
    
    allMainSections.forEach(section => {
        section.classList.remove('active');
    });
    
    allMainHeaders.forEach(header => {
        header.classList.remove('active');
    });
    
    // ถ้าเมนูนี้ยังไม่เปิดอยู่ ให้เปิดมัน (ถ้ากำลังเปิดอยู่แล้ว จะถูกปิดโดยโค้ดด้านบน)
    if (!isCurrentlyActive) {
        section.classList.add('active');
        header.classList.add('active');
    }
}

// === ฟังก์ชันสำหรับเมนูย่อย (เปิดปิดได้อิสระ) ===
function toggleSubSection(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling;
    
    section.classList.toggle('active');
    header.classList.toggle('active');
}

// === ฟังก์ชันปิดเมนูใหญ่ทั้งหมด ===
function closeAllMainSections() {
    const allMainSections = document.querySelectorAll('.main-section-content');
    const allMainHeaders = document.querySelectorAll('.main-section-header');
    
    allMainSections.forEach(section => {
        section.classList.remove('active');
    });
    
    allMainHeaders.forEach(header => {
        header.classList.remove('active');
    });
}
    let accounts = [];
    let currentAccount = null;
    let records = [];
    let editingIndex = null;
    let accountTypes = new Map();
    let tempTypeValue = '';
    
    let backupPassword = null;
    let summaryContext = {};
    let singleDateExportContext = {}; 

    function openExportOptionsModal() { document.getElementById('exportOptionsModal').style.display = 'flex'; }
    function closeExportOptionsModal() { document.getElementById('exportOptionsModal').style.display = 'none'; }
    function closeSingleDateExportModal() { document.getElementById('singleDateExportModal').style.display = 'none'; }
    function closeSingleDateExportFormatModal() { document.getElementById('singleDateExportFormatModal').style.display = 'none'; }

    function initiateSingleDateExport() {
        if (!currentAccount) {
            alert("กรุณาเลือกบัญชีที่ต้องการบันทึกก่อน");
            return;
        }
        closeExportOptionsModal();
        document.getElementById('singleDateAccountName').textContent = currentAccount;
        document.getElementById('exportSingleDate').value = new Date().toISOString().slice(0, 10);
        document.getElementById('singleDateExportModal').style.display = 'flex';
    }
    
    function processSingleDateExport() {
        const selectedDateStr = document.getElementById('exportSingleDate').value;
        if (!selectedDateStr) {
            alert("กรุณาเลือกวันที่ที่ต้องการบันทึก");
            return;
        }
        const filteredRecords = records.filter(record => {
            return record.account === currentAccount && record.dateTime.startsWith(selectedDateStr);
        });
        if (filteredRecords.length === 0) {
            alert(`ไม่พบข้อมูลในบัญชี "${currentAccount}" ในวันที่ ${selectedDateStr}`);
            return;
        }
        singleDateExportContext = {
            records: filteredRecords,
            selectedDate: selectedDateStr,
        };
        closeSingleDateExportModal();
        document.getElementById('singleDateExportFormatModal').style.display = 'flex';
    }
    
    async function handleSingleDateExportAs(format) {
        closeSingleDateExportFormatModal();
        const { records: filteredRecords, selectedDate } = singleDateExportContext;
        
        if (!filteredRecords || filteredRecords.length === 0) {
            alert("เกิดข้อผิดพลาด: ไม่พบข้อมูลที่จะบันทึก");
            return;
        }
        const fileName = prompt(`กรุณากรอกชื่อไฟล์ (ไม่ต้องใส่นามสกุล):`, `${currentAccount}_${selectedDate}`);
        if (!fileName) return;
        const fullFileName = `${fileName}.${format}`;
        
        if (format === 'json') {
            const exportData = {
                accountName: currentAccount,
                isDailyExport: true,
                exportDate: selectedDate,
                records: filteredRecords
            };
            let dataString = JSON.stringify(exportData, null, 2);
            if (backupPassword) {
                alert('กำลังเข้ารหัสข้อมูล...');
                try {
                    const encryptedObject = await encryptData(dataString, backupPassword);
                    dataString = JSON.stringify(encryptedObject, null, 2);
                } catch (e) {
                    alert('การเข้ารหัสล้มเหลว!'); return;
                }
            }
            const blob = new Blob([dataString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = fullFileName; a.click();
            URL.revokeObjectURL(url);
            alert(`บันทึกข้อมูลวันที่ ${selectedDate} เป็น JSON เรียบร้อย\n\nไฟล์: ${fullFileName}`);

        } else if (format === 'xlsx') {
            // สร้างเวิร์กบุ๊กใหม่
            const wb = XLSX.utils.book_new();
            
            // สร้างข้อมูลสำหรับชีต
            let excelData = [];
            
            // เพิ่มข้อมูลส่วนหัว
            excelData.push([`ชื่อบัญชี: ${currentAccount}`]);
            excelData.push([`วันที่ส่งออก: ${selectedDate}`]);
            excelData.push([]);
            
            // เพิ่มหัวข้อตาราง
            excelData.push(["วันที่", "เวลา", "ประเภท", "รายละเอียด", "จำนวนเงิน (บาท)"]);
            
            // เรียงลำดับข้อมูลตามเวลา
            const sortedRecords = [...filteredRecords].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            
            // เพิ่มข้อมูลแต่ละรายการ
            sortedRecords.forEach(record => {
                const dt = new Date(record.dateTime);
                const dateStr = `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
                const timeStr = `${String(dt.getHours()).padStart(2, '0')}.${String(dt.getMinutes()).padStart(2, '0')} น.`;
                excelData.push([dateStr, timeStr, record.type, record.description, record.amount]);
            });
            
            // สร้างชีตจากข้อมูล
            const ws = XLSX.utils.aoa_to_sheet(excelData);
            
            // ตั้งค่าคอลัมน์ให้พอดีกับเนื้อหา
            const colWidths = [
                {wch: 12}, // วันที่
                {wch: 10}, // เวลา
                {wch: 15}, // ประเภท
                {wch: 30}, // รายละเอียด
                {wch: 15}  // จำนวนเงิน
            ];
            ws['!cols'] = colWidths;
            
            // ตั้งค่าหน้ากระดาษสำหรับพิมพ์
            ws['!pageSetup'] = {
                orientation: 'landscape',
                paperSize: 9, // A4
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0,
                margins: {
                    left: 0.7, right: 0.7,
                    top: 0.75, bottom: 0.75,
                    header: 0.3, footer: 0.3
                }
            };
            
            // เพิ่มชีตลงในเวิร์กบุ๊ก
            XLSX.utils.book_append_sheet(wb, ws, "ข้อมูลบัญชี");
            
            // ส่งออกไฟล์
            XLSX.writeFile(wb, fullFileName);
            alert(`บันทึกข้อมูลวันที่ ${selectedDate} เป็น XLSX เรียบร้อย\n\nไฟล์: ${fullFileName}`);
        }
        singleDateExportContext = {};
    }
    
    // *** START: ฟังก์ชันใหม่สำหรับนำเข้าไฟล์รายวัน ***
    function importFromFileForMerging(event) {
        const file = event.target.files[0];
        if (!file) { return; }
        if (!currentAccount) {
            alert("กรุณาเลือกบัญชีปัจจุบัน (บัญชีปลายทาง) ก่อน");
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        const fileName = file.name.toLowerCase();

        const processAndMerge = async (dataString) => {
            try {
                let parsedData = JSON.parse(dataString);
                let finalDataToMerge = null;

                if (parsedData && parsedData.isEncrypted === true) {
                    const password = prompt("ไฟล์นี้ถูกเข้ารหัส กรุณากรอกรหัสผ่านเพื่อถอดรหัส:");
                    if (!password) { alert("ยกเลิกการนำเข้าไฟล์"); return; }
                    alert('กำลังถอดรหัส...');
                    const decryptedString = await decryptData(parsedData, password);
                    if (decryptedString) {
                        finalDataToMerge = JSON.parse(decryptedString);
                        alert('ถอดรหัสสำเร็จ!');
                    } else {
                        alert("ถอดรหัสล้มเหลว! รหัสผ่านอาจไม่ถูกต้อง"); return;
                    }
                } else {
                    finalDataToMerge = parsedData;
                }

                if (finalDataToMerge && finalDataToMerge.isDailyExport === true) {
                    const { exportDate, records: recordsToAdd } = finalDataToMerge;
                    
                    let addedCount = 0;
                    let skippedCount = 0;

                    recordsToAdd.forEach(recordToAdd => {
                        const isDuplicate = records.some(existingRecord =>
                            existingRecord.account === currentAccount &&
                            existingRecord.dateTime === recordToAdd.dateTime &&
                            existingRecord.amount === recordToAdd.amount &&
                            existingRecord.description === recordToAdd.description &&
                            existingRecord.type === recordToAdd.type
                        );
                        if (!isDuplicate) {
                            records.push({ ...recordToAdd, account: currentAccount }); // Force to current account
                            addedCount++;
                        } else {
                            skippedCount++;
                        }
                    });

                    alert(`เติมข้อมูลสำเร็จ!\nเพิ่ม ${addedCount} รายการใหม่\nข้าม ${skippedCount} รายการที่ซ้ำซ้อน`);
                    displayRecords();
                    saveDataAndShowToast();

                } else {
                    alert("ไฟล์ที่เลือกไม่ใช่ไฟล์ข้อมูลรายวันที่ถูกต้อง\nกรุณาใช้ไฟล์ที่ได้จากการ 'บันทึกเฉพาะวันที่เลือก' เท่านั้น");
                }
            } catch (error) {
                alert("ไฟล์ JSON ไม่ถูกต้องหรือเสียหาย: " + error.message);
            }
        };
        
        if (fileName.endsWith('.json')) {
            reader.onload = (e) => processAndMerge(e.target.result);
            reader.readAsText(file);
        } else {
            alert("ฟังก์ชันนี้รองรับเฉพาะไฟล์ .json เท่านั้น");
        }
        
        reader.onerror = () => alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        event.target.value = ''; // Reset file input
    }
    // *** END: ฟังก์ชันใหม่ ***
    
    function showAllTypes(inputElement) { tempTypeValue = inputElement.value; inputElement.value = ''; }
    function restoreType(inputElement) { if (inputElement.value === '') { inputElement.value = tempTypeValue; } }
    function updateMultiAccountSelector() { const selectorDiv = document.getElementById('multiAccountSelector'); const checkboxesDiv = document.getElementById('multiAccountCheckboxes'); checkboxesDiv.innerHTML = ''; if (accounts.length > 1 && editingIndex === null) { selectorDiv.style.display = 'block'; accounts.forEach(acc => { if (acc !== currentAccount) { const itemDiv = document.createElement('div'); itemDiv.className = 'checkbox-item'; const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = `acc-check-${acc}`; checkbox.value = acc; const label = document.createElement('label'); label.htmlFor = `acc-check-${acc}`; label.textContent = acc; itemDiv.appendChild(checkbox); itemDiv.appendChild(label); checkboxesDiv.appendChild(itemDiv); } }); } else { selectorDiv.style.display = 'none'; } }
    function initializeAccountTypes(accountName) { if (!accountTypes.has(accountName)) { accountTypes.set(accountName, { "รายรับ": ["ถูกหวย", "เติมทุน"], "รายจ่าย": ["ชื้อหวย", "โอนกำไร", "ชื้อกับข้าว"] }); } }
    function updateTypeList() { const typeList = document.getElementById('typeList'); if (!currentAccount) { typeList.innerHTML = ''; return; } initializeAccountTypes(currentAccount); const types = accountTypes.get(currentAccount); typeList.innerHTML = ''; types["รายจ่าย"].forEach(type => { const option = document.createElement('option'); option.value = type; typeList.appendChild(option); }); types["รายรับ"].forEach(type => { const option = document.createElement('option'); option.value = type; typeList.appendChild(option); }); }
    function addNewType() { if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อนเพิ่มประเภท"); return; } initializeAccountTypes(currentAccount); const types = accountTypes.get(currentAccount); const category = prompt("เลือกประเภทที่จะเพิ่ม (รายรับ/รายจ่าย):"); if (category !== "รายรับ" && category !== "รายจ่าย") { alert("กรุณากรอก 'รายรับ' หรือ 'รายจ่าย' เท่านั้น"); return; } const typeInput = document.getElementById('type'); const typeName = typeInput.value.trim(); if (!typeName) { alert("กรุณากรอกชื่อประเภทในช่องประเภทก่อน"); return; } if (!types[category].includes(typeName)) { types[category].push(typeName); updateTypeList(); alert(`เพิ่มประเภท "${typeName}" ในหมวด "${category}" เรียบร้อย`); saveToLocal(); } else { alert("ประเภทนี้มีอยู่แล้ว"); } }
    function editType() { if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อนแก้ไขประเภท"); return; } initializeAccountTypes(currentAccount); const types = accountTypes.get(currentAccount); const typeInput = document.getElementById('type'); const currentType = typeInput.value.trim(); if (!currentType) { alert("กรุณาเลือกหรือพิมพ์ประเภทที่ต้องการแก้ไข"); return; } let foundCategory = null; for (const category in types) { if (types[category].includes(currentType)) { foundCategory = category; break; } } if (!foundCategory) { alert("ไม่พบประเภทที่ต้องการแก้ไข"); return; } const newName = prompt("กรุณากรอกชื่อประเภทใหม่:", currentType); if (newName && newName !== currentType) { const index = types[foundCategory].indexOf(currentType); types[foundCategory][index] = newName; records.forEach(record => { if (record.account === currentAccount && record.type === currentType) { record.type = newName; } }); updateTypeList(); typeInput.value = newName; alert("แก้ไขชื่อประเภทเรียบร้อย"); saveToLocal(); } }
    function deleteType() { if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อนลบประเภท"); return; } initializeAccountTypes(currentAccount); const types = accountTypes.get(currentAccount); const typeInput = document.getElementById('type'); const currentType = typeInput.value.trim(); if (!currentType) { alert("กรุณาเลือกหรือพิมพ์ประเภทที่ต้องการลบ"); return; } let foundCategory = null; for (const category in types) { if (types[category].includes(currentType)) { foundCategory = category; break; } } if (!foundCategory) { alert("ไม่พบประเภทที่ต้องการลบ"); return; } if (confirm(`คุณแน่ใจว่าจะลบประเภท "${currentType}" หรือไม่?`)) { const index = types[foundCategory].indexOf(currentType); types[foundCategory].splice(index, 1); updateTypeList(); typeInput.value = ''; alert("ลบประเภทเรียบร้อย"); saveToLocal(); } }
    function toggleRecordsVisibility() { const detailsSection = document.getElementById('detailsSection'); if (detailsSection.style.display === 'none' || detailsSection.style.display === '') { detailsSection.style.display = 'block'; } else { detailsSection.style.display = 'none'; } }
    function addAccount() { const accountName = prompt("กรุณากรอกชื่อบัญชีใหม่:"); if (accountName && !accounts.includes(accountName)) { accounts.push(accountName); updateAccountSelect(); updateMultiAccountSelector(); alert("เพิ่มบัญชีสำเร็จ"); saveToLocal(); } else { alert("ชื่อบัญชีซ้ำหรือกรอกข้อมูลไม่ถูกต้อง"); } }
    function updateAccountSelect() { const accountSelect = document.getElementById('accountSelect'); accountSelect.innerHTML = '<option value="">เลือกบัญชี</option>'; accounts.forEach(account => { const option = document.createElement('option'); option.value = account; option.textContent = account; accountSelect.appendChild(option); }); }
    
    function changeAccount() {
        currentAccount = document.getElementById('accountSelect').value;
        document.getElementById('accountName').textContent = currentAccount || "";
        updateTypeList();
        displayRecords();
        updateMultiAccountSelector();
        updateImportAccountSelect();
    }
    
    function updateImportAccountSelect() {
        const importSelect = document.getElementById('importAccountSelect');
        const importButton = document.querySelector('#import-from-account-section button');
        importSelect.innerHTML = '';
        const otherAccounts = accounts.filter(acc => acc !== currentAccount);
        if (otherAccounts.length === 0 || !currentAccount) {
            importSelect.innerHTML = '<option value="">ไม่มีบัญชีอื่นให้เลือก</option>';
            importSelect.disabled = true;
            if (importButton) importButton.disabled = true;
        } else {
            importSelect.disabled = false;
            if (importButton) importButton.disabled = false;
            importSelect.innerHTML = '<option value="">-- เลือกบัญชี --</option>';
            otherAccounts.forEach(acc => {
                const option = document.createElement('option');
                option.value = acc;
                option.textContent = acc;
                importSelect.appendChild(option);
            });
        }
    }

    function importEntriesFromAccount() {
        const sourceAccount = document.getElementById('importAccountSelect').value;
        const importDateStr = document.getElementById('importDate').value;

        if (!currentAccount) {
            alert("กรุณาเลือกบัญชีปัจจุบัน (บัญชีปลายทาง) ก่อน");
            return;
        }
        if (!sourceAccount) {
            alert("กรุณาเลือกบัญชีต้นทางที่ต้องการดึงข้อมูล");
            return;
        }
        if (!importDateStr) {
            alert("กรุณาเลือกวันที่ของข้อมูลที่ต้องการดึง");
            return;
        }

        const recordsToImport = records.filter(record => {
            return record.account === sourceAccount && record.dateTime.startsWith(importDateStr);
        });

        if (recordsToImport.length === 0) {
            alert(`ไม่พบข้อมูลในบัญชี "${sourceAccount}" ของวันที่ ${importDateStr}`);
            return;
        }

        const confirmImport = confirm(`พบ ${recordsToImport.length} รายการในบัญชี "${sourceAccount}" ของวันที่ ${importDateStr}\n\nคุณต้องการคัดลอกรายการทั้งหมดมายังบัญชี "${currentAccount}" หรือไม่? (ข้อมูลซ้ำจะถูกข้าม)`);

        if (confirmImport) {
            let importedCount = 0;
            let skippedCount = 0;
            recordsToImport.forEach(recordToAdd => {
                const isDuplicate = records.some(existingRecord => 
                    existingRecord.account === currentAccount &&
                    existingRecord.dateTime === recordToAdd.dateTime &&
                    existingRecord.amount === recordToAdd.amount &&
                    existingRecord.description === recordToAdd.description &&
                    existingRecord.type === recordToAdd.type
                );
                if (!isDuplicate) {
                    const newEntry = { ...recordToAdd, account: currentAccount };
                    records.push(newEntry);
                    importedCount++;
                } else {
                    skippedCount++;
                }
            });
            displayRecords();
            saveDataAndShowToast();
            alert(`คัดลอกข้อมูลสำเร็จ!\nเพิ่ม ${importedCount} รายการใหม่\nข้าม ${skippedCount} รายการที่ซ้ำซ้อน`);
        }
    }

    function editAccount() { if (!currentAccount) { alert("กรุณาเลือกบัญชีที่ต้องการแก้ไข"); return; } const newAccountName = prompt("กรุณากรอกชื่อบัญชีใหม่:", currentAccount); if (newAccountName && newAccountName !== currentAccount && !accounts.includes(newAccountName)) { const oldAccountName = currentAccount; const index = accounts.indexOf(oldAccountName); if (index > -1) { accounts[index] = newAccountName; records.forEach(record => { if (record.account === oldAccountName) { record.account = newAccountName; } }); if (accountTypes.has(oldAccountName)) { const oldTypes = accountTypes.get(oldAccountName); accountTypes.set(newAccountName, oldTypes); accountTypes.delete(oldAccountName); } currentAccount = newAccountName; updateAccountSelect(); document.getElementById('accountSelect').value = newAccountName; document.getElementById('accountName').textContent = currentAccount; displayRecords(); updateMultiAccountSelector(); alert("แก้ไขชื่อบัญชีเรียบร้อย"); saveToLocal(); } } else { alert("ชื่อบัญชีซ้ำหรือกรอกข้อมูลไม่ถูกต้อง"); } }
    function deleteAccount() { if (currentAccount) { const confirmDelete = confirm(`คุณแน่ใจว่าจะลบบัญชี "${currentAccount}" และข้อมูลทั้งหมดในบัญชีนี้หรือไม่?`); if (confirmDelete) { const accountToDelete = currentAccount; const index = accounts.indexOf(accountToDelete); if (index > -1) { accounts.splice(index, 1); } accountTypes.delete(accountToDelete); records = records.filter(rec => rec.account !== accountToDelete); currentAccount = null; document.getElementById('accountSelect').value = ""; document.getElementById('accountName').textContent = ""; updateAccountSelect(); displayRecords(); updateMultiAccountSelector(); alert("ลบบัญชีเรียบร้อย"); saveToLocal(); } } else { alert("กรุณาเลือกบัญชีที่ต้องการลบ"); } }
    
    function deleteRecordsByDate() {
        const dateInput = document.getElementById('deleteByDateInput');
        const selectedDate = dateInput.value;
        if (!currentAccount) {
            alert("กรุณาเลือกบัญชีที่ต้องการลบข้อมูลก่อน");
            return;
        }
        if (!selectedDate) {
            alert("กรุณาเลือกวันที่ที่ต้องการลบข้อมูล");
            return;
        }
        const recordsToDelete = records.filter(record =>
            record.account === currentAccount && record.dateTime.startsWith(selectedDate)
        );
        if (recordsToDelete.length === 0) {
            alert(`ไม่พบข้อมูลในบัญชี "${currentAccount}" ของวันที่ ${selectedDate}`);
            return;
        }
        const confirmDelete = confirm(
            `คุณแน่ใจหรือไม่ว่าจะลบข้อมูลทั้งหมด ${recordsToDelete.length} รายการ ของวันที่ ${selectedDate} ในบัญชี "${currentAccount}"?\n\n*** การกระทำนี้ไม่สามารถย้อนกลับได้! ***`
        );
        if (confirmDelete) {
            records = records.filter(record => !recordsToDelete.includes(record));
            displayRecords();
            saveDataAndShowToast();
            alert(`ลบข้อมูล ${recordsToDelete.length} รายการของวันที่ ${selectedDate} เรียบร้อยแล้ว`);
            dateInput.value = ''; 
        }
    }

    function addEntry() {
        let entryDateInput = document.getElementById('entryDate').value;
        let entryTimeInput = document.getElementById('entryTime').value;
        const typeInput = document.getElementById('type');
        const typeText = typeInput.value.trim();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        let datePart, timePart;
        if (!entryDateInput || !entryTimeInput) {
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            datePart = !entryDateInput ? `${y}-${m}-${d}` : entryDateInput;
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            timePart = !entryTimeInput ? `${hh}:${mm}` : entryTimeInput;
        } else {
            datePart = entryDateInput;
            timePart = entryTimeInput;
        }
        const dateTime = `${datePart} ${timePart}`;
        if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อนเพิ่มรายการ"); return; }
        if (!typeText) { alert("กรุณากรอกประเภท"); return; }
        if (!description) { alert("กรุณากรอกรายละเอียด"); return; }
        if (isNaN(amount) || amount <= 0) { alert("กรุณากรอกจำนวนเงินที่ถูกต้อง"); return; }
        initializeAccountTypes(currentAccount);
        const types = accountTypes.get(currentAccount);
        let entryCategory = 'expense';
        if (types["รายรับ"].includes(typeText)) {
            entryCategory = 'income';
        }
        if (editingIndex !== null) {
            records[editingIndex] = { dateTime, type: typeText, description, amount, account: currentAccount };
            editingIndex = null;
        } else {
            records.push({ dateTime, type: typeText, description, amount, account: currentAccount });
            const selectedCheckboxes = document.querySelectorAll('#multiAccountCheckboxes input:checked');
            selectedCheckboxes.forEach(checkbox => {
                const targetAccount = checkbox.value;
                records.push({ dateTime, type: typeText, description, amount, account: targetAccount });
            });
        }
        displayRecords();
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('entryDate').value = '';
        document.getElementById('entryTime').value = '';
        typeInput.value = '';
        document.querySelectorAll('#multiAccountCheckboxes input:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        saveDataAndShowToast(entryCategory);
        updateMultiAccountSelector();
    }

    function saveDataAndShowToast(entryCategory = 'neutral') { const dataToSave = { accounts: [...accounts], currentAccount: currentAccount, records: [...records], accountTypes: Array.from(accountTypes.entries()), backupPassword: backupPassword }; try { localStorage.setItem('accountData', JSON.stringify(dataToSave)); } catch (error) { console.error("บันทึกข้อมูลไม่สำเร็จ:", error); alert("⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูล"); return; } const toast = document.getElementById('toast'); toast.textContent = '✓ บันทึกข้อมูลสำเร็จแล้ว'; if (entryCategory === 'income') { toast.style.backgroundColor = '#28a745'; } else if (entryCategory === 'expense') { toast.style.backgroundColor = '#dc3545'; } else { toast.style.backgroundColor = '#007bff'; } toast.className = "toast-notification show"; setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 2500); }
    function displayRecords() { const recordBody = document.getElementById('recordBody'); recordBody.innerHTML = ""; const filteredRecords = records.filter(record => record.account === currentAccount) .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); filteredRecords.forEach((record, index) => { const originalIndex = records.findIndex(r => r === record); const dateTime = new Date(record.dateTime); const formattedDate = `${String(dateTime.getDate()).padStart(2, '0')}/${String(dateTime.getMonth() + 1).padStart(2, '0')}/${dateTime.getFullYear()}`; const formattedTime = `${String(dateTime.getHours()).padStart(2, '0')}.${String(dateTime.getMinutes()).padStart(2, '0')} น.`; const row = document.createElement('tr'); row.innerHTML = ` <td>${formattedDate}</td> <td>${formattedTime}</td> <td>${record.type}</td> <td>${record.description}</td> <td>${record.amount.toLocaleString()} บาท</td> <td> <button onclick="editRecord(${originalIndex})">แก้ไข</button> <button onclick="deleteRecord(${originalIndex})">ลบ</button> </td> `; recordBody.appendChild(row); }); if (filteredRecords.length === 0) { const row = document.createElement('tr'); row.innerHTML = `<td colspan="6" style="text-align: center;">ไม่มีข้อมูล</td>`; recordBody.appendChild(row); } }
    function editRecord(index) {
        const record = records[index];
        document.getElementById('type').value = record.type;
        document.getElementById('description').value = record.description;
        document.getElementById('amount').value = record.amount;
        const [datePart, timePart] = record.dateTime.split(' ');
        document.getElementById('entryDate').value = datePart;
        document.getElementById('entryTime').value = timePart;
        editingIndex = index;
        updateMultiAccountSelector();
    }
    
    function deleteRecord(index) { if (confirm("คุณแน่ใจว่าจะลบรายการนี้หรือไม่?")) { records.splice(index, 1); displayRecords(); saveDataAndShowToast(); } }
    
    function parseDateInput(dateStr) {
        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return null;
        }
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

    function openSummaryOutputModal() { document.getElementById('summaryOutputModal').style.display = 'flex'; }
    function closeSummaryOutputModal() { document.getElementById('summaryOutputModal').style.display = 'none'; summaryContext = {}; }
    
function handleSummaryOutput(choice) {
    if (!summaryContext || !summaryContext.summaryResult) {
        console.error("Summary context is missing. Cannot proceed.");
        closeSummaryOutputModal();
        return;
    }
    if (choice === 'display') {
        const htmlForDisplay = buildOriginalSummaryHtml(summaryContext);
        openSummaryModal(htmlForDisplay);
    } else if (choice === 'xlsx') {
        const { summaryResult, title, dateString, remark, transactionDaysInfo, periodName } = summaryContext;
        exportSummaryToXlsx(summaryResult, title, dateString, remark, transactionDaysInfo, periodName);
    } else if (choice === 'pdf') {
        const printContainer = document.getElementById('print-container');
        if (printContainer) {
            const htmlWithDetailsForPdf = buildPdfSummaryHtml(summaryContext);
            printContainer.innerHTML = `<div class="summaryResult">${htmlWithDetailsForPdf}</div>`;
            setTimeout(() => { window.print(); }, 250);
        }
    }
    closeSummaryOutputModal();
}

    function generateSummaryData(startDate, endDate) {
        if (!currentAccount || !accountTypes.has(currentAccount)) { alert("ไม่พบบัญชีหรือประเภทของบัญชี"); return null; }
        const summary = { income: {}, expense: {}, totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0 };
        const periodRecords = []; let totalBalance = 0; const accountSpecificTypes = accountTypes.get(currentAccount);
        records.forEach(record => {
            if (record.account !== currentAccount) return;
            const recordDate = new Date(record.dateTime);
            if (recordDate <= endDate) {
                if (accountSpecificTypes["รายรับ"].includes(record.type)) { totalBalance += record.amount; }
                else if (accountSpecificTypes["รายจ่าย"].includes(record.type)) { totalBalance -= record.amount; }
            }
            if (!(recordDate >= startDate && recordDate <= endDate)) return;
            periodRecords.push(record);
            if (accountSpecificTypes["รายรับ"].includes(record.type)) {
                summary.totalIncome += record.amount; summary.incomeCount++;
                if (!summary.income[record.type]) summary.income[record.type] = { amount: 0, count: 0 };
                summary.income[record.type].amount += record.amount; summary.income[record.type].count++;
            } else if (accountSpecificTypes["รายจ่าย"].includes(record.type)) {
                summary.totalExpense += record.amount; summary.expenseCount++;
                if (!summary.expense[record.type]) summary.expense[record.type] = { amount: 0, count: 0 };
                summary.expense[record.type].amount += record.amount; summary.expense[record.type].count++;
            }
        });
        periodRecords.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        return { summary, periodRecords, totalBalance };
    }
    
    function buildOriginalSummaryHtml(context) {
        const { summaryResult, title, dateString, remark, transactionDaysInfo, type, thaiDateString, headerLine1, headerLine2, headerLine3 } = context;
        const { summary, periodRecords, totalBalance } = summaryResult;
        let incomeHTML = ''; for (const type in summary.income) { incomeHTML += `<p>- ${type} : ${summary.income[type].count} ครั้ง เป็นเงิน ${summary.income[type].amount.toLocaleString()} บาท</p>`; }
        let expenseHTML = ''; for (const type in summary.expense) { expenseHTML += `<p>- ${type} : ${summary.expense[type].count} ครั้ง เป็นเงิน ${summary.expense[type].amount.toLocaleString()} บาท</p>`; }
        let recordsHTML = '';
        if ((type === 'today' || type === 'byDayMonth') && periodRecords.length > 0) {
            recordsHTML = ` <div style="margin-top: 20px;"> <h4 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">${headerLine3}</h4> <table style="width: 100%; border-collapse: collapse; margin-top: 10px;"> <thead><tr style="background-color: #f2f2f2;"><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">เวลา</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">ประเภท</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">รายละเอียด</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">จำนวนเงิน</th></tr></thead> <tbody> ${periodRecords.map(record => {
                const [date, time] = record.dateTime.split(" ");
                const [hours, minutes] = time.split(":");
                const isIncome = accountTypes.get(currentAccount)["รายรับ"].includes(record.type); const color = isIncome ? "#4CAF50" : "#F44336";
                return `<tr><td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${hours}.${minutes}</td><td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${record.type}</td><td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${record.description}</td><td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${color}; font-weight: bold;">${record.amount.toLocaleString()}</td></tr>`;
            }).join('')} </tbody> </table> </div>`;
        }
        let comparisonText = ''; let comparisonColor = ''; let differenceAmount = 0;
        if (summary.totalIncome > summary.totalExpense) {
            differenceAmount = summary.totalIncome - summary.totalExpense;
            comparisonText = `รายได้มากกว่ารายจ่าย = ${differenceAmount.toLocaleString()} บาท`;
            comparisonColor = 'blue';
        } else if (summary.totalIncome < summary.totalExpense) {
            differenceAmount = summary.totalExpense - summary.totalIncome;
            comparisonText = `รายจ่ายมากกว่ารายได้ = ${differenceAmount.toLocaleString()} บาท`;
            comparisonColor = 'red';
        } else {
            comparisonText = 'รายได้เท่ากับรายจ่าย';
            comparisonColor = 'black';
        }
        let summaryLineHTML;
        if (summary.totalIncome === 0 && summary.totalExpense === 0) {
             summaryLineHTML = `<p style="color: green; font-weight: bold;">${headerLine1} ไม่มีธุระกรรมการเงิน</p>`;
        } else {
             summaryLineHTML = `<p style="color: ${comparisonColor}; font-weight: bold;">${headerLine1} ${comparisonText}</p>`;
        }
        let totalBalanceLine;
        if (type === 'range' || type === 'all') {
            totalBalanceLine = `<p><span style="color: blue; font-size: 14px; font-weight: bold;">${headerLine2} = </span><span style="color: ${totalBalance >= 0 ? 'green' : 'red'}; font-size: 16px; font-weight: bold;">${totalBalance.toLocaleString()}</span> บาท</p>`
        } else {
            totalBalanceLine = `<p><span style="color: blue; font-size: 14px; font-weight: bold;">เงินในบัญชีถึงวันนี้มี = </span><span style="color: ${totalBalance >= 0 ? 'green' : 'red'}; font-size: 16px; font-weight: bold;">${totalBalance.toLocaleString()}</span> บาท</p>`
        }
        const summaryDateTime = new Date().toLocaleString("th-TH", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + ' น.';
        return ` <p><strong>ชื่อบัญชี:</strong> ${currentAccount}</p> <p><strong>สรุปเมื่อวันที่ : </strong> ${summaryDateTime}</p> <p><strong>${title} : </strong> ${thaiDateString}</p> ${transactionDaysInfo ? transactionDaysInfo : ''} <hr style="border: 0.5px solid green;"><p><strong>รายรับ : </strong> ${summary.incomeCount} ครั้ง เป็นเงิน ${summary.totalIncome.toLocaleString()} บาท</p>${incomeHTML} <hr style="border: 0.5px solid green;"><p><strong>รายจ่าย : </strong> ${summary.expenseCount} ครั้ง เป็นเงิน ${summary.totalExpense.toLocaleString()} บาท</p>${expenseHTML} <hr style="border: 0.5px solid green;">${summaryLineHTML} ${totalBalanceLine} <p>ข้อความเพิ่ม : <span style="color: orange;">${remark}</span></p> ${recordsHTML}`;
    }

function exportSummaryToXlsx(summaryResult, title, dateString, remark, transactionDaysInfo = null, periodName) {
    const { summary, periodRecords, totalBalance } = summaryResult;
    
    // สร้างเวิร์กบุ๊กใหม่
    const wb = XLSX.utils.book_new();
    
    // สร้างข้อมูลสำหรับชีต
    let excelData = [];
    
    // ส่วนหัวเอกสาร
    const summaryDateTime = new Date().toLocaleString("th-TH", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    }) + ' น.';
    
    // เพิ่มข้อมูลส่วนหัว
    excelData.push(['สรุปข้อมูลบัญชี']);
    excelData.push(['ชื่อบัญชี:', currentAccount]);
    excelData.push(['สรุปเมื่อวันที่:', summaryDateTime]);
    excelData.push([`${title} :`, dateString]);
    excelData.push([]);
    
    // ข้อมูลวันทำธุรกรรม (ถ้ามี)
    if (transactionDaysInfo) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = transactionDaysInfo;
        const pElements = tempDiv.querySelectorAll('p');
        pElements.forEach(p => {
            excelData.push([p.innerText]);
        });
        excelData.push([]);
    }
    
    // รายรับ
    excelData.push(['รายรับ :', `${summary.incomeCount} ครั้ง เป็นเงิน ${summary.totalIncome.toLocaleString()} บาท`]);
    for (const type in summary.income) {
        excelData.push([`- ${type} : ${summary.income[type].count} ครั้ง เป็นเงิน ${summary.income[type].amount.toLocaleString()} บาท`]);
    }
    excelData.push([]);
    
    // รายจ่าย
    excelData.push(['รายจ่าย :', `${summary.expenseCount} ครั้ง เป็นเงิน ${summary.totalExpense.toLocaleString()} บาท`]);
    for (const type in summary.expense) {
        excelData.push([`- ${type} : ${summary.expense[type].count} ครั้ง เป็นเงิน ${summary.expense[type].amount.toLocaleString()} บาท`]);
    }
    excelData.push([]);
    
    // สรุปยอด
    const netAmount = summary.totalIncome - summary.totalExpense;
    let comparisonText = '';
    let comparisonColor = 'black';
    
    if (summary.totalIncome > summary.totalExpense) {
        comparisonText = `รายได้มากกว่ารายจ่าย = ${netAmount.toLocaleString()} บาท`;
        comparisonColor = 'blue';
    } else if (summary.totalIncome < summary.totalExpense) {
        comparisonText = `รายจ่ายมากกว่ารายได้ = ${Math.abs(netAmount).toLocaleString()} บาท`;
        comparisonColor = 'red';
    } else {
        comparisonText = 'รายได้เท่ากับรายจ่าย';
    }
    
    if (summary.totalIncome === 0 && summary.totalExpense === 0) {
        excelData.push(['สรุป :', 'ไม่มีธุรกรรมการเงิน']);
    } else {
        excelData.push(['สรุป :', comparisonText]);
    }
    
    // ยอดเงินคงเหลือ
    if (periodName === 'ทั้งหมด' || periodName.includes('ถึง')) {
        excelData.push(['เงินในบัญชีถึงวันนี้มี =', `${totalBalance.toLocaleString()} บาท`]);
    } else {
        excelData.push(['เงินคงเหลือในบัญชีทั้งหมด =', `${totalBalance.toLocaleString()} บาท`]);
    }
    
    // หมายเหตุ
    excelData.push(['ข้อความเพิ่ม :', remark]);
    excelData.push([]);
    
    // รายการธุรกรรม (ถ้ามี)
    if (periodRecords.length > 0) {
        excelData.push(['--- รายการธุรกรรม ---']);
        excelData.push(['วันที่', 'เวลา', 'ประเภท', 'รายละเอียด', 'จำนวนเงิน (บาท)']);
        
        periodRecords.forEach(record => {
            const d = new Date(record.dateTime);
            const date = d.toLocaleDateString('th-TH', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const time = `${hours}.${minutes} น.`;
            
            excelData.push([
                date, 
                time, 
                record.type, 
                record.description, 
                record.amount.toLocaleString()
            ]);
        });
    }
    
    // สร้างชีตจากข้อมูล
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // ตั้งค่าความกว้างของคอลัมน์
    const colWidths = [
        {wch: 15}, // คอลัมน์ A
        {wch: 30}, // คอลัมน์ B
        {wch: 15}, // คอลัมน์ C
        {wch: 30}, // คอลัมน์ D
        {wch: 20}  // คอลัมน์ E
    ];
    ws['!cols'] = colWidths;
    
    // ตั้งค่าหน้ากระดาษสำหรับพิมพ์ (เหมือนกับ PDF)
    ws['!pageSetup'] = {
        orientation: 'portrait',
        paperSize: 9, // A4
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
            left: 0.7, right: 0.7,
            top: 0.75, bottom: 0.75,
            header: 0.3, footer: 0.3
        }
    };
    
    // เพิ่มหัวเรื่องให้กับเอกสาร
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({s: {r: 0, c: 0}, e: {r: 0, c: 4}});
    
    // เพิ่มชีตลงในเวิร์กบุ๊ก
    XLSX.utils.book_append_sheet(wb, ws, "สรุปข้อมูลบัญชี");
    
    // สร้างชื่อไฟล์
    const fileName = `สรุป_${currentAccount}_${periodName}_${new Date().getTime()}.xlsx`;
    
    // ส่งออกไฟล์
    XLSX.writeFile(wb, fileName);
}

// เพิ่มฟังก์ชันสำหรับจัดรูปแบบเซลล์ใน Excel
function applyExcelStyles(ws, data) {
    // กำหนดสไตล์ให้กับส่วนหัว
    if (!ws['!merges']) ws['!merges'] = [];
    
    // รวมเซลล์สำหรับหัวเรื่องหลัก
    ws['!merges'].push({s: {r: 0, c: 0}, e: {r: 0, c: 4}});
    
    // กำหนดความกว้างคอลัมน์
    if (!ws['!cols']) ws['!cols'] = [];
    ws['!cols'][0] = {wch: 25};
    ws['!cols'][1] = {wch: 35};
    ws['!cols'][2] = {wch: 15};
    ws['!cols'][3] = {wch: 30};
    ws['!cols'][4] = {wch: 20};
    
    return ws;
}

// เรียกใช้ฟังก์ชันจัดรูปแบบหลังจากสร้าง worksheet
// ในฟังก์ชัน exportSummaryToXlsx ให้เพิ่มบรรทัดนี้ก่อนเพิ่มชีตลงในเวิร์กบุ๊ก:
// ws = applyExcelStyles(ws, excelData);
function closeFormatModal() {
    document.getElementById('formatSelectionModal').style.display = 'none';
}
function buildPdfSummaryHtml(context) {
    const { summaryResult, title, dateString, remark, transactionDaysInfo, type, thaiDateString, headerLine1, headerLine2, headerLine3 } = context;
    const { summary, periodRecords, totalBalance } = summaryResult;
    
    // เพิ่ม style line-height: 0.5; ในส่วนของรายรับ
    let incomeHTML = ''; 
    for (const type in summary.income) { 
        incomeHTML += `<p style="margin-left: 15px; line-height: 0.5;">- ${type} : ${summary.income[type].count} ครั้ง เป็นเงิน ${summary.income[type].amount.toLocaleString()} บาท</p>`; 
    }
    
    // เพิ่ม style line-height: 0.5; ในส่วนของรายจ่าย
    let expenseHTML = ''; 
    for (const type in summary.expense) { 
        expenseHTML += `<p style="margin-left: 15px; line-height: 0.5;">- ${type} : ${summary.expense[type].count} ครั้ง เป็นเงิน ${summary.expense[type].amount.toLocaleString()} บาท</p>`; 
    }
    
 let recordsHTML = '';
if (periodRecords.length > 0) {
    recordsHTML = ` 
    <div style="margin-top: 20px;"> 
        <h4>รายละเอียดธุรกรรม</h4> 
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="width: 15%; padding: 4px; border: 1px solid #ddd;">วันเดือนปี</th>
                    <th style="width: 10%; padding: 4px; border: 1px solid #ddd;">เวลา</th>
                    <th style="width: 15%; padding: 4px; border: 1px solid #ddd;">ประเภท</th>
                    <th style="width: 30%; padding: 4px; border: 1px solid #ddd;">รายละเอียด</th>
                    <th style="width: 15%; padding: 4px; border: 1px solid #ddd;">จำนวนเงิน</th>
                </tr>
            </thead>
            <tbody>
                ${periodRecords.map(record => {
                    const recordDate = new Date(record.dateTime);
                    const formattedDate = recordDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const [date, time] = record.dateTime.split(" ");
                    const [hours, minutes] = time.split(":");
                    const isIncome = accountTypes.get(currentAccount)["รายรับ"].includes(record.type); 
                    const color = isIncome ? "#4CAF50" : "#F44336";
                    
                    return `
                        <tr>
                            <td style="padding: 4px; border: 1px solid #ddd; word-wrap: break-word;">${formattedDate}</td>
                            <td style="padding: 4px; border: 1px solid #ddd; word-wrap: break-word;">${hours}.${minutes}</td>
                            <td style="padding: 4px; border: 1px solid #ddd; word-wrap: break-word;">${record.type}</td>
                            <td style="padding: 4px; border: 1px solid #ddd; word-wrap: break-word;">${record.description}</td>
                            <td style="padding: 4px; border: 1px solid #ddd; color: ${color}; font-weight: bold; word-wrap: break-word;">${record.amount.toLocaleString()}</td>
                        </tr>`;
                }).join('')} 
            </tbody> 
        </table> 
    </div>`;
}

    
    let comparisonText = ''; let comparisonColor = ''; let differenceAmount = 0;
    if (summary.totalIncome > summary.totalExpense) {
        differenceAmount = summary.totalIncome - summary.totalExpense;
        comparisonText = `รายได้มากกว่ารายจ่าย = ${differenceAmount.toLocaleString()} บาท`;
        comparisonColor = 'blue';
    } else if (summary.totalIncome < summary.totalExpense) {
        differenceAmount = summary.totalExpense - summary.totalIncome;
        comparisonText = `รายจ่ายมากกว่ารายได้ = ${differenceAmount.toLocaleString()} บาท`;
        comparisonColor = 'red';
    } else {
        comparisonText = 'รายได้เท่ากับรายจ่าย';
        comparisonColor = 'black';
    }
    
    let summaryLineHTML;
    if (summary.totalIncome === 0 && summary.totalExpense === 0) {
        summaryLineHTML = `<p style="color: green; font-weight: bold; line-height: 0.5;">${headerLine1} ไม่มีธุรกรรมการเงิน</p>`;
    } else {
        summaryLineHTML = `<p style="color: ${comparisonColor}; font-weight: bold; line-height: 0.5;">${headerLine1} ${comparisonText}</p>`;
    }
    
    let totalBalanceLine;
    if (type === 'range' || type === 'all') {
        totalBalanceLine = `<p style="line-height: 0.5;"><b>${headerLine2} = </b><b style="color: ${totalBalance >= 0 ? 'green' : 'red'}; font-size: 1.1em;">${totalBalance.toLocaleString()}</b> บาท</p>`
    } else {
        totalBalanceLine = `<p style="line-height: 0.5;"><b>เงินในบัญชีถึงวันนี้มี = </b><b style="color: ${totalBalance >= 0 ? 'green' : 'red'}; font-size: 1.1em;">${totalBalance.toLocaleString()}</b> บาท</p>`
    }
    
    const summaryDateTime = new Date().toLocaleString("th-TH", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + ' น.';
    
    return ` 
        <p style="line-height: 0.5;"><strong>ชื่อบัญชี:</strong> ${currentAccount}</p> 
        <p style="line-height: 0.5;"><strong>สรุปเมื่อวันที่ : </strong> ${summaryDateTime}</p> 
        <p style="line-height: 0.5;"><strong>${title} : </strong> ${thaiDateString}</p> 
        ${transactionDaysInfo ? transactionDaysInfo.replace(/<p/g, '<p style="line-height: 0.5;"') : ''} 
        <hr style="border: 0.5px solid green;">
        <p style="line-height: 0.5;"><strong>รายรับ : </strong> ${summary.incomeCount} ครั้ง เป็นเงิน ${summary.totalIncome.toLocaleString()} บาท</p>
        ${incomeHTML} 
        <hr style="border: 0.5px solid green;">
        <p style="line-height: 0.5;"><strong>รายจ่าย : </strong> ${summary.expenseCount} ครั้ง เป็นเงิน ${summary.totalExpense.toLocaleString()} บาท</p>
        ${expenseHTML} 
        <hr style="border: 0.5px solid green;">
        ${summaryLineHTML} 
        ${totalBalanceLine} 
        <p style="line-height: 0.5;"><b>ข้อความเพิ่ม : </b><span style="color: orange;">${remark}</span></p> 
        ${recordsHTML}
    `;
}
    
    function exportSummaryToCsv(summaryResult, title, dateString, remark, transactionDaysInfo = null, periodName) {
        const { summary, periodRecords, totalBalance } = summaryResult; 
        let csvRows = [];
        const summaryDateTime = new Date().toLocaleString("th-TH", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) + ' น.';
        csvRows.push(['สรุปข้อมูลบัญชี']); csvRows.push(['ชื่อบัญชี:', currentAccount]); csvRows.push(['สรุปเมื่อวันที่:', summaryDateTime]); csvRows.push([`${title}:`, dateString]);
        if(transactionDaysInfo) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = transactionDaysInfo;
            const pElements = tempDiv.querySelectorAll('p');
            pElements.forEach(p => csvRows.push([p.innerText]));
        }
        csvRows.push(['']);
        csvRows.push([`--- รายรับ: ${summary.incomeCount} ครั้ง | รวม ${summary.totalIncome.toLocaleString()} บาท ---`]);
        for (const type in summary.income) { csvRows.push([`  ${type}`, `${summary.income[type].count} ครั้ง`, `${summary.income[type].amount.toLocaleString()} บาท`]); }
        csvRows.push(['']);
        csvRows.push([`--- รายจ่าย: ${summary.expenseCount} ครั้ง | รวม ${summary.totalExpense.toLocaleString()} บาท ---`]);
        for (const type in summary.expense) { csvRows.push([`  ${type}`, `${summary.expense[type].count} ครั้ง`, `${summary.expense[type].amount.toLocaleString()} บาท`]); }
        csvRows.push(['']); 
        csvRows.push(['--- สรุปยอดสุทธิ ---']);
        const netAmount = summary.totalIncome - summary.totalExpense; 
        const netText = netAmount > 0 ? 'รายได้มากกว่ารายจ่าย' : (netAmount < 0 ? 'รายจ่ายมากกว่ารายได้' : 'รายได้เท่ากับรายจ่าย');
        let summaryLineText = `สรุป: ${netText} = ${Math.abs(netAmount).toLocaleString()} บาท`;
        if(netAmount === 0 && summary.totalIncome === 0 && summary.totalExpense === 0) { summaryLineText = `สรุป: ไม่มีรายการการเงินในช่วงนี้`; }
        csvRows.push([summaryLineText]); 
        csvRows.push([`ยอดเงินคงเหลือในบัญชี (ณ วันสิ้นสุด):`, `${totalBalance.toLocaleString()} บาท`]); 
        csvRows.push(['หมายเหตุ:', remark]); 
        csvRows.push(['']); 
        if (periodRecords.length > 0) {
            csvRows.push([`--- รายละเอียดธุรกรรม ---`]);
            csvRows.push(['วันที่', 'เวลา', 'ประเภท', 'รายละเอียด', 'จำนวนเงิน']);
            periodRecords.forEach(record => {
                const d = new Date(record.dateTime);
                const date = d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                const time = `${hours}.${minutes} น.`;
                const amount = record.amount.toLocaleString('th-TH');
                csvRows.push([date, time, record.type, record.description, amount]);
            });
        }
        const csvContent = Papa.unparse(csvRows, { header: false }); 
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const fileName = `สรุป_${currentAccount}_${periodName}_${new Date().getTime()}.csv`;
        const link = document.createElement("a"); 
        link.href = URL.createObjectURL(blob); 
        link.download = fileName; 
        link.click(); 
        URL.revokeObjectURL(link.href);
    }
    
    function summarizeToday() {
        if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อน"); return; }
        const startDate = new Date(new Date().setHours(0, 0, 0, 0));
        const endDate = new Date(new Date().setHours(23, 59, 59, 999));
        const summaryResult = generateSummaryData(startDate, endDate);
        if (!summaryResult) return;
        const remarkInput = prompt("กรุณากรอกหมายเหตุ (ถ้าไม่กรอกจะใช้ 'No comment'):", "No comment") || "No comment";
        const thaiDate = new Date(startDate);
        const thaiDateString = `${thaiDate.getDate()} ${thaiDate.toLocaleString('th-TH', { month: 'long' })} ${thaiDate.getFullYear() + 543}`;
        summaryContext = {
            summaryResult, type: 'today', title: "สรุปข้อมูลของวันที่", dateString: new Date(startDate).toLocaleDateString('en-CA'), thaiDateString: thaiDateString, remark: remarkInput, periodName: 'วันนี้', headerLine1: 'สรุปวันนี้ :', headerLine3: `รายละเอียดวันนี้ : ${thaiDateString}`
        };
        openSummaryOutputModal();
    }

    function summarizeByDayMonth() {
        if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อน"); return; }
        const dayMonthInput = document.getElementById('customDayMonth').value;
        const selectedDate = parseDateInput(dayMonthInput);
        if (!selectedDate) { alert("กรุณาเลือกวันที่ให้ถูกต้อง"); return; }
        const startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endDate = new Date(selectedDate.setHours(23, 59, 59, 999));
        const summaryResult = generateSummaryData(startDate, endDate);
        if (!summaryResult) return;
        const remarkInput = prompt("กรุณากรอกหมายเหตุ (ถ้าไม่กรอกจะใช้ 'No comment'):", "No comment") || "No comment";
        const thaiDate = new Date(startDate);
        const thaiDateString = `${thaiDate.getDate()} ${thaiDate.toLocaleString('th-TH', { month: 'long' })} ${thaiDate.getFullYear() + 543}`;
        summaryContext = {
            summaryResult, type: 'byDayMonth', title: "สรุปข้อมูลของวันที่", dateString: dayMonthInput, thaiDateString: thaiDateString, remark: remarkInput, periodName: dayMonthInput.replace(/-/g, '_'), headerLine1: 'สรุป :', headerLine3: `รายละเอียดวันที่เลือก : ${thaiDateString}`
        };
        openSummaryOutputModal();
    }
    
    function summarize() {
        if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อน"); return; }
        const startDateStr = document.getElementById('startDate').value;
        const endDateStr = document.getElementById('endDate').value;
        const startDate = parseDateInput(startDateStr); 
        const endDate = parseDateInput(endDateStr);
        if (!startDate || !endDate) { alert("กรุณาเลือกวันที่ให้ครบถ้วน"); return; }
        if (startDate > endDate) { alert("วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด"); return; }
        endDate.setHours(23, 59, 59, 999);
        const summaryResult = generateSummaryData(startDate, endDate);
        if (!summaryResult) return;
        const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const transactionDays = new Set(summaryResult.periodRecords.map(r => new Date(r.dateTime).toDateString()));
        const transactionDaysInfo = `<p style="font-size: 16px; color: blue; font-weight: bold;">จำนวน ${daysDiff} วัน</p><p style="font-size: 16px; color: #333; font-weight: bold;">ทำธุรกรรม ${transactionDays.size} วัน, ไม่ได้ทำ ${daysDiff - transactionDays.size} วัน</p>`;
        const remarkInput = prompt("กรุณากรอกหมายเหตุ (ถ้าไม่กรอกจะใช้ 'No comment'):", "No comment") || "No comment";
        const thaiDateString = `${startDate.toLocaleDateString('th-TH', {day: 'numeric', month: 'long', year: 'numeric'})} ถึง ${endDate.toLocaleDateString('th-TH', {day: 'numeric', month: 'long', year: 'numeric'})}`;
        summaryContext = {
            summaryResult, type: 'range', title: "สรุปวันที่", dateString: `${startDateStr} to ${endDateStr}`, thaiDateString: thaiDateString, remark: remarkInput, transactionDaysInfo: transactionDaysInfo, periodName: `จาก${startDateStr.replace(/-/g, '_')}_ถึง${endDateStr.replace(/-/g, '_')}`, headerLine1: 'สรุป :', headerLine2: 'เงินในบัญชีถึงวันนี้มี'
        };
        openSummaryOutputModal();
    }
    
    function summarizeAll() {
        if (!currentAccount) { alert("กรุณาเลือกบัญชีก่อน"); return; }
        const accountRecords = records.filter(r => r.account === currentAccount);
        if (accountRecords.length === 0) { alert("ไม่มีข้อมูลในบัญชีนี้ให้สรุป"); return; }
        const allDates = accountRecords.map(r => new Date(r.dateTime));
        const startDate = new Date(Math.min.apply(null, allDates)); const endDate = new Date(Math.max.apply(null, allDates));
        startDate.setHours(0, 0, 0, 0); endDate.setHours(23, 59, 59, 999);
        const summaryResult = generateSummaryData(startDate, endDate);
        if (!summaryResult) return;
        const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const transactionDays = new Set(summaryResult.periodRecords.map(r => new Date(r.dateTime).toDateString()));
        const transactionDaysInfo = `<p style="font-size: 16px; color: blue; font-weight: bold;">รวมเป็นเวลา ${daysDiff} วัน</p><p style="font-size: 16px; color: #333; font-weight: bold;">ทำธุรกรรม ${transactionDays.size} วัน, ไม่ได้ทำ ${daysDiff - transactionDays.size} วัน</p>`;
        const remarkInput = prompt("กรุณากรอกหมายเหตุ (ถ้าไม่กรอกจะใช้ 'No comment'):", "No comment") || "No comment";
        const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
        const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        const thaiDateString = `${startDate.toLocaleDateString('th-TH', {day: 'numeric', month: 'long', year: 'numeric'})} ถึง ${endDate.toLocaleDateString('th-TH', {day: 'numeric', month: 'long', year: 'numeric'})}`;
        summaryContext = {
            summaryResult, type: 'all', title: "สรุปข้อมูลทั้งหมดตั้งแต่", dateString: `${startDateStr} to ${endDateStr}`, thaiDateString: thaiDateString, remark: remarkInput, transactionDaysInfo: transactionDaysInfo, periodName: 'ทั้งหมด', headerLine1: 'สรุป :', headerLine2: 'เงินคงเหลือในบัญชีทั้งหมด'
        };
        openSummaryOutputModal();
    }
    
    function arrayBufferToBase64(buffer) { let binary = ''; const bytes = new Uint8Array(buffer); const len = bytes.byteLength; for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); } return window.btoa(binary); }
    function base64ToArrayBuffer(base64) { const binary_string = window.atob(base64); const len = binary_string.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binary_string.charCodeAt(i); } return bytes.buffer; }
    async function deriveKey(password, salt) { const enc = new TextEncoder(); const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']); return window.crypto.subtle.deriveKey({ "name": 'PBKDF2', salt: salt, "iterations": 100000, "hash": 'SHA-256' }, keyMaterial, { "name": 'AES-GCM', "length": 256 }, true, [ "encrypt", "decrypt" ] ); }
    async function encryptData(dataString, password) { const salt = window.crypto.getRandomValues(new Uint8Array(16)); const iv = window.crypto.getRandomValues(new Uint8Array(12)); const key = await deriveKey(password, salt); const enc = new TextEncoder(); const encodedData = enc.encode(dataString); const encryptedContent = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encodedData); return { isEncrypted: true, salt: arrayBufferToBase64(salt), iv: arrayBufferToBase64(iv), encryptedData: arrayBufferToBase64(encryptedContent) }; }
    async function decryptData(encryptedPayload, password) { try { const salt = base64ToArrayBuffer(encryptedPayload.salt); const iv = base64ToArrayBuffer(encryptedPayload.iv); const data = base64ToArrayBuffer(encryptedPayload.encryptedData); const key = await deriveKey(password, salt); const decryptedContent = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, data); const dec = new TextDecoder(); return dec.decode(decryptedContent); } catch (e) { console.error("Decryption failed:", e); return null; } }
    
    function saveBackupPassword(e) {
        e.preventDefault();
        const newPassword = document.getElementById('backup-password').value;
        const confirmPassword = document.getElementById('backup-password-confirm').value;
        if (newPassword !== confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่อีกครั้ง');
            return;
        }
        backupPassword = newPassword.trim() || null;
        saveToLocal(true); 
        alert('บันทึกรหัสผ่านสำหรับไฟล์สำรองเรียบร้อยแล้ว');
        document.getElementById('backup-password').value = '';
        document.getElementById('backup-password-confirm').value = '';
        renderBackupPasswordStatus();
    }
    
    function renderBackupPasswordStatus() {
        const statusEl = document.getElementById('password-status');
        if (backupPassword) {
            statusEl.textContent = 'สถานะ: มีการตั้งรหัสผ่านแล้ว';
            statusEl.style.color = 'green';
        } else {
            statusEl.textContent = 'สถานะ: ยังไม่มีการตั้งรหัสผ่าน (ไฟล์สำรองจะไม่ถูกเข้ารหัส)';
            statusEl.style.color = '#f5a623';
        }
    }

    function loadFromLocal() {
        const data = localStorage.getItem('accountData');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                accounts = parsed.accounts || [];
                currentAccount = parsed.currentAccount || null;
                records = parsed.records || [];
                accountTypes = new Map(parsed.accountTypes || []);
                backupPassword = parsed.backupPassword || null; 
                renderBackupPasswordStatus();
                updateAccountSelect();
                if (currentAccount) {
                    document.getElementById('accountSelect').value = currentAccount;
                }
                changeAccount();
            } catch (error) {
                console.error("โหลดข้อมูลจาก LocalStorage ไม่สำเร็จ", error);
            }
        }
        updateMultiAccountSelector();
    }

    function closeFormatModal() { document.getElementById('formatSelectionModal').style.display = 'none'; }
    function closeExportSingleAccountModal() { document.getElementById('exportSingleAccountModal').style.display = 'none'; }
function saveToFile() { 
    closeExportOptionsModal(); 
    if (accounts.length === 0) { 
        alert("ไม่มีบัญชีให้บันทึก"); 
        return; 
    } 
    // เปิด modal สำหรับเลือกรูปแบบไฟล์
    document.getElementById('formatSelectionModal').style.display = 'flex'; 
}
    
    function saveToLocal(fromPasswordSave = false) {
        const dataToSave = {
            accounts: [...accounts],
            currentAccount: currentAccount,
            records: [...records],
            accountTypes: Array.from(accountTypes.entries()),
            backupPassword: backupPassword
        };
        try {
            localStorage.setItem('accountData', JSON.stringify(dataToSave));
            if (!fromPasswordSave) {
                 alert('✓ บันทึกข้อมูลชั่วคราวในเบราว์เซอร์เรียบร้อยแล้ว');
            }
        } catch (error) {
            console.error("บันทึกข้อมูลชั่วคราวไม่สำเร็จ:", error);
            alert("⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูลชั่วคราว: " + error.message);
        }
    }

    async function handleSaveAs(format) {
        closeFormatModal();
        const formatLower = format.toLowerCase().trim();
        const fileName = prompt("กรุณากรอกชื่อไฟล์สำหรับสำรองข้อมูล (ไม่ต้องใส่นามสกุล):", "สำรองทุกบัญชี");
        if (!fileName) return;
        const now = new Date();
        const dateTimeString = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        if (formatLower === 'json') {
            const fullFileName = `${fileName}_${dateTimeString}.json`;
            const data = { accounts, currentAccount, records, accountTypes: Array.from(accountTypes.entries()), backupPassword: null };
            let dataString = JSON.stringify(data, null, 2);
            if (backupPassword) {
                alert('กำลังเข้ารหัสข้อมูล...');
                try {
                    const encryptedObject = await encryptData(dataString, backupPassword);
                    dataString = JSON.stringify(encryptedObject, null, 2);
                } catch (e) {
                    alert('การเข้ารหัสล้มเหลว!'); return;
                }
            }
            const blob = new Blob([dataString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = fullFileName; a.click();
            URL.revokeObjectURL(url);
        } else if (formatLower === 'csv') {
            const fullFileName = `${fileName}_${dateTimeString}.csv`;
            let csvData = [];
            csvData.push(['###ALL_ACCOUNTS_BACKUP_CSV###']);
            csvData.push(['###ACCOUNTS_LIST###', ...accounts]);
            csvData.push(['###ACCOUNT_TYPES_START###']);
            for (const [accName, typesObj] of accountTypes.entries()) {
                initializeAccountTypes(accName);
                const currentTypes = accountTypes.get(accName);
                if (currentTypes.รายรับ && currentTypes.รายรับ.length > 0) csvData.push([accName, 'รายรับ', ...currentTypes.รายรับ]);
                if (currentTypes.รายจ่าย && currentTypes.รายจ่าย.length > 0) csvData.push([accName, 'รายจ่าย', ...currentTypes.รายจ่าย]);
            }
            csvData.push(['###ACCOUNT_TYPES_END###']);
            csvData.push(['###DATA_START###']);
            csvData.push(["วันที่", "เวลา", "ประเภท", "รายละเอียด", "จำนวนเงิน (บาท)", "บัญชี"]);
            const allSortedRecords = [...records].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            allSortedRecords.forEach(record => {
                const dateTime = new Date(record.dateTime);
                const formattedDate = `${String(dateTime.getDate()).padStart(2, '0')}/${String(dateTime.getMonth() + 1).padStart(2, '0')}/${dateTime.getFullYear()}`;
                const formattedTime = `${String(dateTime.getHours()).padStart(2, '0')}.${String(dateTime.getMinutes()).padStart(2, '0')} น.`;
                csvData.push([formattedDate, formattedTime, record.type, record.description, record.amount, record.account]);
            });
            let csvContent = Papa.unparse(csvData, { header: false });
            const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fullFileName;
            link.click();
            URL.revokeObjectURL(link.href);
            alert(`บันทึกข้อมูลทั้งหมดลงในไฟล์ CSV "${fullFileName}" เรียบร้อยแล้ว`);
        }
    }
    
    function exportSelectedAccount() { closeExportOptionsModal(); if (!currentAccount) { alert("กรุณาเลือกบัญชีที่ต้องการบันทึกก่อน"); return; } document.getElementById('exportSingleAccountModal').style.display = 'flex'; }
    
    async function handleExportSelectedAs(format) {
        closeExportSingleAccountModal();
        if (!currentAccount) {
            alert("เกิดข้อผิดพลาด: ไม่พบบัญชีที่เลือก");
            return;
        }
        const fileName = prompt(`กรุณากรอกชื่อไฟล์สำหรับบัญชี ${currentAccount} (ไม่ต้องใส่นามสกุล):`, currentAccount);
        if (!fileName) return;
        const now = new Date();
        const dateTimeString = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        if (format === 'json') {
            const fullFileName = `${fileName}_${dateTimeString}.json`;
            const accountData = {
                accountName: currentAccount,
                records: records.filter(record => record.account === currentAccount),
                accountTypes: accountTypes.get(currentAccount) || { "รายรับ": [], "รายจ่าย": [] }
            };
            let dataString = JSON.stringify(accountData, null, 2);
            if (backupPassword) {
                alert('กำลังเข้ารหัสข้อมูล...');
                try {
                    const encryptedObject = await encryptData(dataString, backupPassword);
                    dataString = JSON.stringify(encryptedObject, null, 2);
                } catch (e) {
                    alert('การเข้ารหัสล้มเหลว!'); return;
                }
            }
            const blob = new Blob([dataString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = fullFileName; a.click();
            URL.revokeObjectURL(url);
        } else if (format === 'csv') {
            const fullFileName = `${fileName}_${dateTimeString}.csv`;
            initializeAccountTypes(currentAccount);
            const accountCurrentTypes = accountTypes.get(currentAccount);
            let excelData = [];
            excelData.push([`ชื่อบัญชี: ${currentAccount}`]);
            excelData.push(['###ACCOUNT_TYPES###']);
            excelData.push(['รายรับ', ...(accountCurrentTypes['รายรับ'] || [])]);
            excelData.push(['รายจ่าย', ...(accountCurrentTypes['รายจ่าย'] || [])]);
            excelData.push(['###DATA_START###']);
            excelData.push(["วันที่", "เวลา", "ประเภท", "รายละเอียด", "จำนวนเงิน (บาท)"]);
            const filteredRecords = records.filter(record => record.account === currentAccount).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            filteredRecords.forEach(record => {
                const dateTime = new Date(record.dateTime);
                const formattedDate = `${String(dateTime.getDate()).padStart(2, '0')}/${String(dateTime.getMonth() + 1).padStart(2, '0')}/${dateTime.getFullYear()}`;
                const formattedTime = `${String(dateTime.getHours()).padStart(2, '0')}.${String(dateTime.getMinutes()).padStart(2, '0')} น.`;
                excelData.push([formattedDate, formattedTime, record.type, record.description, record.amount]);
            });
            let csvContent = Papa.unparse(excelData, { header: false });
            const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = fullFileName; link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
            alert(`บันทึกบัญชี "${currentAccount}" เป็น CSV เรียบร้อย\n\nไฟล์: ${fullFileName}`);
        }
    }

    async function loadFromFile(event) {
        const file = event.target.files[0]; if (!file) { return; }
        const reader = new FileReader();
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.csv')) {
            reader.onload = (e) => loadFromCsv(e.target.result);
            reader.readAsText(file, 'UTF-8');
        } else if (fileName.endsWith('.json')) {
            reader.onload = async (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    let finalDataToMerge = null;
                    if (importedData && importedData.isEncrypted === true) {
                        const password = prompt("ไฟล์นี้ถูกเข้ารหัส กรุณากรอกรหัสผ่านเพื่อถอดรหัส:");
                        if (!password) { alert("ยกเลิกการนำเข้าไฟล์"); event.target.value = ''; return; }
                        alert('กำลังถอดรหัส...');
                        const decryptedString = await decryptData(importedData, password);
                        if (decryptedString) {
                            finalDataToMerge = JSON.parse(decryptedString);
                            alert('ถอดรหัสสำเร็จ!');
                        } else {
                            alert("ถอดรหัสล้มเหลว! รหัสผ่านอาจไม่ถูกต้อง"); event.target.value = ''; return;
                        }
                    } else {
                        finalDataToMerge = importedData;
                    }
                    if (finalDataToMerge.accounts && Array.isArray(finalDataToMerge.accounts)) {
                        if(confirm("ไฟล์นี้เป็นไฟล์สำรองข้อมูล JSON ทั้งหมด ต้องการโหลดข้อมูลทั้งหมดทับของเดิมหรือไม่?")) {
                            accounts = finalDataToMerge.accounts;
                            records = finalDataToMerge.records;
                            accountTypes = new Map(finalDataToMerge.accountTypes);
                            currentAccount = finalDataToMerge.currentAccount;
                            alert("โหลดข้อมูลทั้งหมดจาก JSON สำเร็จ");
                        }
                    } else if (finalDataToMerge.isDailyExport === true) {
                        const { accountName, exportDate, records: recordsToAdd } = finalDataToMerge;
                        const confirmMsg = `ไฟล์นี้มีข้อมูลของวันที่ ${exportDate} จำนวน ${recordsToAdd.length} รายการ สำหรับบัญชี "${accountName}"\n\nกด OK เพื่อ "เพิ่ม" รายการเหล่านี้ลงในบัญชี (ข้อมูลซ้ำจะถูกข้าม)\nกด Cancel เพื่อยกเลิก`;
                        if (confirm(confirmMsg)) {
                            if (!accounts.includes(accountName)) { accounts.push(accountName); }
                            let addedCount = 0;
                            let skippedCount = 0;
                            recordsToAdd.forEach(recordToAdd => {
                                const isDuplicate = records.some(existingRecord =>
                                    existingRecord.account === accountName &&
                                    existingRecord.dateTime === recordToAdd.dateTime &&
                                    existingRecord.amount === recordToAdd.amount &&
                                    existingRecord.description === recordToAdd.description &&
                                    existingRecord.type === recordToAdd.type
                                );
                                if (!isDuplicate) {
                                    records.push({ ...recordToAdd, account: accountName });
                                    addedCount++;
                                } else {
                                    skippedCount++;
                                }
                            });
                            currentAccount = accountName;
                            alert(`เติมข้อมูลสำเร็จ!\nเพิ่ม ${addedCount} รายการใหม่\nข้าม ${skippedCount} รายการที่ซ้ำซ้อน`);
                        }
                    } else if (finalDataToMerge.accountName) {
                        const confirmMsg = `ไฟล์นี้เป็นข้อมูลของบัญชี "${finalDataToMerge.accountName}"\n\nกด OK เพื่อ "แทนที่" ข้อมูลทั้งหมดของบัญชีนี้\nกด Cancel เพื่อยกเลิก`;
                        if (confirm(confirmMsg)) {
                            if (!accounts.includes(finalDataToMerge.accountName)) accounts.push(finalDataToMerge.accountName);
                            records = records.filter(r => r.account !== finalDataToMerge.accountName);
                            records.push(...(finalDataToMerge.records || []));
                            accountTypes.set(finalDataToMerge.accountName, finalDataToMerge.accountTypes || { "รายรับ": [], "รายจ่าย": [] });
                            currentAccount = finalDataToMerge.accountName;
                            alert(`แทนที่ข้อมูลบัญชี "${finalDataToMerge.accountName}" สำเร็จ`);
                        }
                    } else { throw new Error("รูปแบบไฟล์ JSON ไม่ถูกต้อง"); }
                    updateAccountSelect();
                    if (currentAccount) document.getElementById('accountSelect').value = currentAccount;
                    changeAccount();
                    saveToLocal();
                    updateMultiAccountSelector();
                } catch (error) {
                    alert("ไฟล์ JSON ไม่ถูกต้องหรือเสียหาย: " + error.message);
                }
            };
            reader.readAsText(file);
        } else {
            alert("กรุณาเลือกไฟล์ .json หรือ .csv เท่านั้น");
        }
        reader.onerror = () => alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        event.target.value = '';
    }
    
function loadFromCsv(csvText) {
    let csvImportData = { isFullBackup: false, isDailyExport: false, accountName: '', exportDate: '', types: { "รายรับ": [], "รายจ่าย": [] }, records: [] };
    let inTypesSection = false;
    let inDataSection = false;
    let dataHeaderPassed = false;
    
    // ใช้ Papa Parse เพื่อแยกวิเคราะห์ CSV
    Papa.parse(csvText, {
        skipEmptyLines: true,
        step: function(results) {
            const row = results.data;
            const firstCell = (row[0] || '').trim();
            
            if (firstCell === '###ALL_ACCOUNTS_BACKUP_CSV###') {
                csvImportData.isFullBackup = true;
                return;
            }
            
            if (firstCell.startsWith('isDailyExport:')) {
                csvImportData.isDailyExport = true;
                csvImportData.exportDate = firstCell.split(':')[1].trim();
                return;
            }
            
            if (csvImportData.isFullBackup) {
                // กรณีไฟล์ CSV แบบเต็ม (ทุกบัญชี)
                if (firstCell === '###ACCOUNTS_LIST###') {
                    // อ่านรายการบัญชี
                    csvImportData.accounts = row.slice(1).filter(Boolean);
                } else if (firstCell === '###ACCOUNT_TYPES_START###') {
                    inTypesSection = true;
                } else if (firstCell === '###ACCOUNT_TYPES_END###') {
                    inTypesSection = false;
                } else if (firstCell === '###DATA_START###') {
                    inDataSection = true;
                    dataHeaderPassed = false;
                } else if (inTypesSection) {
                    // อ่านข้อมูลประเภทบัญชี
                    const accName = row[0];
                    const category = row[1];
                    const types = row.slice(2).filter(Boolean);
                    
                    if (accName && category && types.length > 0) {
                        if (!csvImportData.typesMap) csvImportData.typesMap = new Map();
                        if (!csvImportData.typesMap.has(accName)) {
                            csvImportData.typesMap.set(accName, { "รายรับ": [], "รายจ่าย": [] });
                        }
                        
                        if (category === 'รายรับ') {
                            csvImportData.typesMap.get(accName)["รายรับ"] = types;
                        } else if (category === 'รายจ่าย') {
                            csvImportData.typesMap.get(accName)["รายจ่าย"] = types;
                        }
                    }
                } else if (inDataSection) {
                    // อ่านข้อมูลธุรกรรม
                    if (!dataHeaderPassed) {
                        dataHeaderPassed = true;
                        return;
                    }
                    
                    try {
                        const [dateStr, timeStr, type, description, amountStr, account] = row;
                        if (!dateStr || !timeStr || !type || !amountStr || !account) {
                            throw new Error("ข้อมูลไม่ครบถ้วน");
                        }
                        
                        // แปลงรูปแบบวันที่
                        const [day, month, year] = dateStr.split('/');
                        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        
                        // แปลงรูปแบบเวลา
                        const formattedTime = timeStr.replace(' น.', '').replace('.', ':');
                        
                        const amount = parseFloat(amountStr.replace(/,/g, ''));
                        if (isNaN(amount)) throw new Error("จำนวนเงินไม่ถูกต้อง");
                        
                        csvImportData.records.push({
                            dateTime: `${formattedDate} ${formattedTime}`,
                            type: type.trim(),
                            description: (description || '').trim(),
                            amount,
                            account: account.trim()
                        });
                    } catch (e) {
                        console.warn(`ข้ามแถวข้อมูล CSV ที่มีปัญหา: ${e.message}`, row);
                    }
                }
            } else {
                // กรณีไฟล์ CSV แบบบัญชีเดียวหรือรายวัน
                if (firstCell.startsWith('ชื่อบัญชี:')) {
                    csvImportData.accountName = firstCell.split(':')[1].trim();
                } else if (firstCell === '###ACCOUNT_TYPES###') {
                    inTypesSection = true;
                    inDataSection = false;
                } else if (firstCell === '###DATA_START###') {
                    inTypesSection = false;
                    inDataSection = true;
                    dataHeaderPassed = false;
                } else if (inTypesSection) {
                    if (firstCell === 'รายรับ') {
                        csvImportData.types['รายรับ'] = row.slice(1).filter(Boolean);
                    } else if (firstCell === 'รายจ่าย') {
                        csvImportData.types['รายจ่าย'] = row.slice(1).filter(Boolean);
                    }
                } else if (inDataSection) {
                    if (!dataHeaderPassed) {
                        dataHeaderPassed = true;
                        return;
                    }
                    
                    const [dateStr, timeStr, type, description, amountStr] = row;
                    try {
                        if (!dateStr || !timeStr || !type || !amountStr) {
                            throw new Error("ข้อมูลไม่ครบถ้วน");
                        }
                        
                        // แปลงรูปแบบวันที่
                        const [day, month, year] = dateStr.split('/');
                        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        
                        // แปลงรูปแบบเวลา
                        const formattedTime = timeStr.replace(' น.', '').replace('.', ':');
                        
                        const amount = parseFloat(amountStr.replace(/,/g, ''));
                        if (isNaN(amount)) throw new Error("จำนวนเงินไม่ถูกต้อง");
                        
                        csvImportData.records.push({
                            dateTime: `${formattedDate} ${formattedTime}`,
                            type: type.trim(),
                            description: (description || '').trim(),
                            amount,
                            account: csvImportData.accountName
                        });
                    } catch (e) {
                        console.warn(`ข้ามแถวข้อมูล CSV ที่มีปัญหา: ${e.message}`, row);
                    }
                }
            }
        },
        complete: function() {
            if (csvImportData.isFullBackup) {
                // กรณีไฟล์ CSV แบบเต็ม
                const confirmMsg = "ไฟล์นี้เป็นไฟล์สำรองข้อมูล CSV ทั้งหมด ต้องการโหลดข้อมูลทั้งหมดทับของเดิมหรือไม่?";
                if (confirm(confirmMsg)) {
                    // อัปเดต accounts
                    accounts = csvImportData.accounts || [];
                    
                    // อัปเดต accountTypes
                    if (csvImportData.typesMap) {
                        accountTypes = csvImportData.typesMap;
                    }
                    
                    // อัปเดต records
                    records = csvImportData.records;
                    
                    // ตั้งค่าบัญชีปัจจุบันเป็นบัญชีแรก (ถ้ามี)
                    currentAccount = accounts.length > 0 ? accounts[0] : null;
                    
                    // อัปเดต UI
                    updateAccountSelect();
                    if (currentAccount) {
                        document.getElementById('accountSelect').value = currentAccount;
                    }
                    changeAccount();
                    saveToLocal();
                    
                    alert("โหลดข้อมูลทั้งหมดจาก CSV สำเร็จ");
                }
            } else if (csvImportData.isDailyExport) {
                // กรณีไฟล์รายวัน
                const { accountName, exportDate, records: recordsToAdd } = csvImportData;
                const confirmMsg = `ไฟล์ CSV นี้มีข้อมูลของวันที่ ${exportDate} จำนวน ${recordsToAdd.length} รายการ สำหรับบัญชี "${accountName}"\n\nกด OK เพื่อ "เพิ่ม" รายการเหล่านี้ (ข้อมูลซ้ำจะถูกข้าม)`;
                
                if (confirm(confirmMsg)) {
                    if (!accounts.includes(accountName)) {
                        accounts.push(accountName);
                    }
                    
                    let addedCount = 0;
                    let skippedCount = 0;
                    
                    recordsToAdd.forEach(recordToAdd => {
                        const isDuplicate = records.some(existingRecord =>
                            existingRecord.account === accountName &&
                            existingRecord.dateTime === recordToAdd.dateTime &&
                            existingRecord.amount === recordToAdd.amount &&
                            existingRecord.description === recordToAdd.description &&
                            existingRecord.type === recordToAdd.type
                        );
                        
                        if (!isDuplicate) {
                            records.push(recordToAdd);
                            addedCount++;
                        } else {
                            skippedCount++;
                        }
                    });
                    
                    currentAccount = accountName;
                    alert(`เติมข้อมูลสำเร็จ!\nเพิ่ม ${addedCount} รายการใหม่\nข้าม ${skippedCount} รายการที่ซ้ำซ้อน`);
                    
                    updateAccountSelect();
                    document.getElementById('accountSelect').value = currentAccount;
                    changeAccount();
                    saveToLocal();
                }
            } else if (csvImportData.accountName) {
                // กรณีไฟล์บัญชีเดียว
                const { accountName, records: newRecords, types: importedTypes } = csvImportData;
                const confirmMsg = `คุณต้องการ "แทนที่" ข้อมูลทั้งหมดในบัญชี "${accountName}" ด้วยข้อมูล ${newRecords.length} รายการจากไฟล์ CSV นี้ใช่หรือไม่?\n\nคำเตือน: ข้อมูลเดิมในบัญชีนี้จะถูกลบทั้งหมด!`;
                
                if (confirm(confirmMsg)) {
                    if (!accounts.includes(accountName)) {
                        accounts.push(accountName);
                    }
                    
                    // ลบข้อมูลเดิมของบัญชีนี้
                    records = records.filter(r => r.account !== accountName);
                    
                    // เพิ่มข้อมูลใหม่
                    records.push(...newRecords);
                    
                    // อัปเดตประเภทบัญชี
                    accountTypes.set(accountName, importedTypes);
                    
                    currentAccount = accountName;
                    alert(`แทนที่ข้อมูลบัญชี "${accountName}" สำเร็จ!`);
                    
                    updateAccountSelect();
                    document.getElementById('accountSelect').value = currentAccount;
                    changeAccount();
                    saveToLocal();
                }
            } else {
                alert('ไม่สามารถประมวลผลไฟล์ CSV ได้ รูปแบบอาจไม่ถูกต้อง');
            }
        }
    });
}

    function hideInstallPrompt() { const installGuide = document.getElementById('install-guide'); if (installGuide) { installGuide.style.display = 'none'; } }
    window.addEventListener('appinstalled', () => { console.log('App was installed.'); hideInstallPrompt(); localStorage.setItem('pwa_installed', 'true'); });
    
    window.onload = function () {
        document.getElementById('detailsSection').style.display = 'none';
        loadFromLocal();
        toggleSection('account-section');
        document.getElementById('backup-password-form').addEventListener('submit', saveBackupPassword);
        document.getElementById('show-backup-password').addEventListener('change', (e) => {
            document.getElementById('backup-password').type = e.target.checked ? 'text' : 'password';
            document.getElementById('backup-password-confirm').type = e.target.checked ? 'text' : 'password';
        });
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('summaryModal');
            if (event.target == modal) { closeSummaryModal(); }
        });
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || localStorage.getItem('pwa_installed') === 'true') {
            hideInstallPrompt();
        }
    };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
