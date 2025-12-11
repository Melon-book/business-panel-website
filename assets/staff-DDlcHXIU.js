import{e as o}from"./index-BCkWgzQb.js";const p=async e=>{try{const{data:r,error:t}=await o.from("employees").select("*").eq("user_id",e).eq("status","active").single();if(t)throw t;return{data:r,error:null}}catch(r){return{data:null,error:r.message}}},w=async(e,r={})=>{try{let t=o.from("employees").select(`
        *,
        user:users!user_id(email, full_name, phone, avatar_url),
        created_by_user:users!created_by(email, full_name),
        updated_by_user:users!updated_by(email, full_name),
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).eq("business_id",e).order("created_at",{ascending:!1});r.status&&r.status!=="all"&&(t=t.eq("status",r.status)),r.role&&r.role!=="all"&&(t=t.eq("role",r.role));const{data:n,error:a}=await t;if(a)throw a;return{data:n,error:null}}catch(t){return{data:null,error:t.message}}},y=async e=>{try{const{data:r,error:t}=await o.from("employees").select(`
        *,
        user:users!user_id(email, full_name, phone, avatar_url),
        created_by_user:users!created_by(email, full_name),
        updated_by_user:users!updated_by(email, full_name),
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).eq("id",e).single();if(t)throw t;return{data:r,error:null}}catch(r){return{data:null,error:r.message}}},f=async e=>{try{if(!e.email||!e.first_name||!e.last_name)throw new Error("Email, first name, and last name are required");if(!e.business_id)throw new Error("Business ID is required");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email))throw new Error("Invalid email format");const{data:t}=await o.from("businesses").select("name").eq("id",e.business_id).single(),{data:n,error:a}=await o.functions.invoke("invite-staff",{body:{business_id:e.business_id,email:e.email,first_name:e.first_name,last_name:e.last_name,phone:e.phone,role:e.role,commission_rate:e.commission_rate||10,working_hours:e.working_hours||{},service_ids:e.service_ids||[],is_available_for_booking:e.is_available_for_booking!==!1,businessName:(t==null?void 0:t.name)||"Your Business",lang:"pl"}});if(a)throw new Error(a.message||"Failed to send invitation");if(!n.success)throw new Error(n.error||"Failed to send invitation");return{data:{id:n.employeeId,invitation_token:n.invitationToken},error:null}}catch(r){return{data:null,error:r.message}}},h=async(e,r)=>{try{if(!e)throw new Error("Staff ID is required");const t={...r,updated_by:r.updated_by||null,updated_at:new Date().toISOString()};delete t.service_ids,delete t.id,delete t.created_at,delete t.created_by,delete t.business_id;const{data:n,error:a}=await o.from("employees").update(t).eq("id",e).select(`
        *,
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).single();if(a)throw new Error(`Failed to update employee: ${a.message}`);if(r.service_ids!==void 0){const{error:i}=await u(e,r.service_ids);if(i)throw new Error(`Employee updated but service update failed: ${i}`)}return{data:n,error:null}}catch(t){return{data:null,error:t.message}}},v=async e=>{try{if(!e)throw new Error("Staff ID is required");const{data:r,error:t}=await o.from("appointments").select("id").eq("employee_id",e).limit(1);if(t&&console.warn("Could not check appointments:",t),r&&r.length>0)throw new Error("Cannot delete staff member with existing appointments. Please deactivate instead.");const{error:n}=await o.from("employees").delete().eq("id",e);if(n)throw new Error(`Failed to delete employee: ${n.message}`);return{error:null}}catch(r){return{error:r.message}}},m=async(e,r)=>{try{if(!e||!r||r.length===0)return{data:[],error:null};const t=r.map(i=>({employee_id:e,service_id:i,commission_rate:null})),{data:n,error:a}=await o.from("employee_services").insert(t).select();if(a)throw a;return{data:n,error:null}}catch(t){return{data:null,error:t.message}}},u=async(e,r)=>{try{if(!e)throw new Error("Employee ID is required");const{error:t}=await o.from("employee_services").delete().eq("employee_id",e);if(t)throw t;if(r&&r.length>0){const{data:n,error:a}=await m(e,r);if(a)throw a;return{data:n,error:null}}return{data:[],error:null}}catch(t){return{data:null,error:t.message}}},g=async e=>{try{if(!e)throw new Error("Invitation token is required");const{data:r,error:t}=await o.from("employees").select("id, first_name, last_name, email, invitation_expires_at, businesses(name)").eq("invitation_token",e).single();if(t||!r)throw new Error("Invalid or expired invitation link");if(new Date(r.invitation_expires_at)<new Date)throw new Error("This invitation has expired. Please contact your manager for a new invitation.");return{data:r,error:null}}catch(r){return{data:null,error:r.message}}},b=async(e,r,t,n,a)=>{try{if(!e||!r||!t)throw new Error("Invitation token, email, and password are required");if(!n||!a)throw new Error("First name and last name are required");const{data:i,error:s}=await o.functions.invoke("accept-invitation",{body:{invitation_token:e,email:r,password:t,first_name:n,last_name:a}});if(s)throw new Error(s.message||"Failed to create account");if(!i.success)throw new Error(i.error||"Failed to create account");return{data:{success:!0},error:null}}catch(i){return{data:null,error:i.message}}},E=async e=>{var r,t;try{if(!e)throw new Error("Staff ID is required");const{data:n,error:a}=await o.from("employees").select(`
        *,
        businesses(name),
        employee_services(service_id)
      `).eq("id",e).single();if(a||!n)throw new Error("Staff member not found");if(n.status!=="invited")throw new Error("Can only resend invitation to staff with invited status");const{error:i}=await o.from("employees").delete().eq("id",e);if(i)throw i;const{data:s,error:c}=await o.functions.invoke("invite-staff",{body:{business_id:n.business_id,email:n.email,first_name:n.first_name,last_name:n.last_name,phone:n.phone,role:n.role,commission_rate:n.commission_rate,working_hours:n.working_hours,service_ids:((r=n.employee_services)==null?void 0:r.map(l=>l.service_id))||[],is_available_for_booking:n.is_available_for_booking,businessName:((t=n.businesses)==null?void 0:t.name)||"Your Business",lang:"pl"}});if(c)throw new Error(c.message||"Failed to resend invitation");if(!s.success)throw new Error(s.error||"Failed to resend invitation");return{success:!0,error:null}}catch(n){return{success:!1,error:n.message}}},q=async(e,r,t)=>{try{const{data:n,error:a}=await o.from("appointments").select(`
        *,
        clients(first_name, last_name, phone),
        services(name, duration_minutes)
      `).eq("employee_id",e).gte("appointment_date",r).lte("appointment_date",t).order("appointment_date",{ascending:!0}).order("start_time",{ascending:!0});if(a)throw a;return{data:n,error:null}}catch(n){return{data:null,error:n.message}}},k=async(e,r,t)=>{try{const{data:n,error:a}=await o.from("appointments").select(`
        id,
        status,
        total_amount,
        appointment_date
      `).eq("employee_id",e).gte("appointment_date",r).lte("appointment_date",t);if(a)throw a;const i=n.length,s=n.filter(l=>l.status==="completed").length,c=n.reduce((l,d)=>d.status==="completed"?l+parseFloat(d.total_amount):l,0);return{data:{total_appointments:i,completed_appointments:s,total_revenue:c,completion_rate:i>0?s/i*100:0},error:null}}catch(n){return{data:null,error:n.message}}};export{b as a,p as b,f as c,y as d,q as e,k as f,w as g,v as h,E as r,h as u,g as v};
