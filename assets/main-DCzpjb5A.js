(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))c(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const r="https://chenhsu92-hcc-poc-lite.hf.space";let i={},u={};document.addEventListener("DOMContentLoaded",()=>{m(),d(),setInterval(d,3e4)});async function m(){const t=document.getElementById("apiStatus"),e=document.getElementById("apiStatusText");try{if((await fetch(`${r}/`)).ok)t.classList.add("connected"),e.textContent="Connected";else throw new Error("API not responding")}catch(n){t.classList.add("disconnected"),e.textContent="Disconnected",console.error("API connection error:",n)}}async function d(){await Promise.all([g(),y(),f(),h(),v(),b()])}async function g(){try{const e=await(await fetch(`${r}/api/metrics/system`)).json();u=e,document.getElementById("totalPatients").textContent=e.total_patients.toLocaleString(),document.getElementById("activePatients").textContent=e.active_patients.toLocaleString(),document.getElementById("occupancyRate").textContent=`${e.occupancy_rate}%`,document.getElementById("occupiedBeds").textContent=e.occupied_beds.toLocaleString(),document.getElementById("totalBeds").textContent=e.total_beds.toLocaleString(),document.getElementById("totalStaff").textContent=(e.doctors+e.nurses).toLocaleString(),document.getElementById("doctors").textContent=e.doctors,document.getElementById("nurses").textContent=e.nurses}catch(t){console.error("Error loading system metrics:",t)}}async function y(){try{const e=await(await fetch(`${r}/api/metrics/care-levels`)).json(),n=e.map(o=>o.name.split(" (")[0]),c=e.map(o=>o.active_patients),a=e.map(o=>o.capacity_utilization),s=document.getElementById("careLevelChart");i.careLevel&&i.careLevel.destroy(),i.careLevel=new Chart(s,{type:"bar",data:{labels:n,datasets:[{label:"Active Patients",data:c,backgroundColor:["rgba(37, 99, 235, 0.8)","rgba(14, 165, 233, 0.8)","rgba(16, 185, 129, 0.8)","rgba(245, 158, 11, 0.8)"],borderColor:["rgb(37, 99, 235)","rgb(14, 165, 233)","rgb(16, 185, 129)","rgb(245, 158, 11)"],borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:"Patients by Care Level"},legend:{display:!1}},scales:{y:{beginAtZero:!0}}}});const l=document.getElementById("capacityChart");i.capacity&&i.capacity.destroy(),i.capacity=new Chart(l,{type:"doughnut",data:{labels:n.filter((o,p)=>e[p].occupied_beds>0),datasets:[{label:"Capacity Utilization",data:a.filter(o=>o>0),backgroundColor:["rgba(37, 99, 235, 0.8)","rgba(14, 165, 233, 0.8)","rgba(16, 185, 129, 0.8)"],borderColor:["rgb(37, 99, 235)","rgb(14, 165, 233)","rgb(16, 185, 129)"],borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:"Capacity Utilization (%)"}}}})}catch(t){console.error("Error loading care level metrics:",t)}}async function f(){try{const e=await(await fetch(`${r}/api/metrics/transport`)).json();document.getElementById("dailyTrips").textContent=e.estimated_daily_trips.toLocaleString(),document.getElementById("activeVehicles").textContent=e.active_vehicles}catch(t){console.error("Error loading transport metrics:",t)}}async function h(){try{const e=await(await fetch(`${r}/api/metrics/services`)).json();document.getElementById("ventilatorsInUse").textContent=e.ventilator.users.toLocaleString(),document.getElementById("dialysisSessions").textContent=e.hemodialysis.users.toLocaleString(),document.getElementById("rehabSessions").textContent=e.rehabilitation.users.toLocaleString(),document.getElementById("homeCareVisits").textContent=e.home_care.users.toLocaleString();const n=document.getElementById("servicesChart");i.services&&i.services.destroy(),i.services=new Chart(n,{type:"bar",data:{labels:["Rehabilitation","Hemodialysis","Home Care","Ventilator"],datasets:[{label:"Utilization Rate (%)",data:[e.rehabilitation.utilization_rate,e.hemodialysis.utilization_rate,e.home_care.utilization_rate,e.ventilator.dependency_rate],backgroundColor:"rgba(37, 99, 235, 0.8)",borderColor:"rgb(37, 99, 235)",borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{title:{display:!0,text:"Service Utilization Rates"}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:function(c){return c+"%"}}}}}})}catch(t){console.error("Error loading service metrics:",t)}}async function v(){try{const e=await(await fetch(`${r}/api/analytics/risk-patients`)).json(),n=document.getElementById("riskMetrics");n.innerHTML=`
            <div class="risk-item high">
                <span class="risk-label">High Fall Risk</span>
                <span class="risk-value">${e.high_fall_risk.count} (${e.high_fall_risk.percentage}%)</span>
            </div>
            <div class="risk-item medium">
                <span class="risk-label">Low ADL Score</span>
                <span class="risk-value">${e.low_adl_score.count} (${e.low_adl_score.percentage}%)</span>
            </div>
            <div class="risk-item high">
                <span class="risk-label">Approaching Deadline</span>
                <span class="risk-value">${e.approaching_deadline.count} (${e.approaching_deadline.percentage}%)</span>
            </div>
            <div class="risk-item medium">
                <span class="risk-label">Complex Cases</span>
                <span class="risk-value">${e.complex_cases.count} (${e.complex_cases.percentage}%)</span>
            </div>
        `}catch(t){console.error("Error loading risk analytics:",t)}}async function b(){try{const e=await(await fetch(`${r}/api/financial/projections`)).json(),n=document.getElementById("financialMetrics");n.innerHTML=`
            <div class="financial-item">
                <span class="financial-label">Monthly Bed Fees</span>
                <span class="financial-value">NT$${e.monthly_revenue.bed_fees.toLocaleString()}</span>
            </div>
            <div class="financial-item">
                <span class="financial-label">NHI Reimbursement</span>
                <span class="financial-value">NT$${e.monthly_revenue.nhi_reimbursement.toLocaleString()}</span>
            </div>
            <div class="financial-item">
                <span class="financial-label">Additional Charges</span>
                <span class="financial-value">NT$${e.monthly_revenue.additional_charges.toLocaleString()}</span>
            </div>
            <div class="financial-item" style="border-top: 2px solid #e2e8f0; margin-top: 8px; padding-top: 8px;">
                <span class="financial-label"><strong>Total Monthly Revenue</strong></span>
                <span class="financial-value" style="color: #10b981; font-size: 1.1rem;">
                    <strong>NT$${e.monthly_revenue.total.toLocaleString()}</strong>
                </span>
            </div>
        `}catch(t){console.error("Error loading financial metrics:",t)}}
