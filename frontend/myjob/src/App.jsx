import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {Toaster} from "react-hot-toast";
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import JobSeekerdashboard from './pages/JobSeekers/JobSeekerdashboard';
import JobDetails from './pages/JobSeekers/JobDetails';
import SavedJobs from './pages/JobSeekers/SavedJobs';
import MyApplications from './pages/JobSeekers/MyApplications';
import UserProfile from './pages/JobSeekers/UserProfile';
import CompanyProfileView from './pages/JobSeekers/CompanyProfileView';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ManageJobs from './pages/Employer/ManageJobs';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import EmployerProfilePage from './pages/Employer/EmployerProfilePage';
import EditProfileDetails from './pages/Employer/EditProfileDetails';
import JobSeekerProfileView from './pages/Employer/JobSeekerProfileView';
import EditJobSeekerProfile from './pages/JobSeekers/EditJobSeekerProfile';
import ProtectedRoutes from './pages/routes/ProtectedRoutes';


const App = () => {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/find-jobs' element={<JobSeekerdashboard/>}/>
            <Route path='/job/:jobId' element={<JobDetails/>}/>
            <Route path='/saved-jobs' element={<SavedJobs/>}/>
            <Route path='/my-applications' element={<MyApplications/>}/>
            <Route path='/profile' element={<UserProfile/>}/>
            <Route path='/company/:companyId' element={<CompanyProfileView/>}/>

            <Route element={<ProtectedRoutes requiredRole="employer"/>}>
              <Route path='/employer-dashboard' element={<EmployerDashboard/>}/>
              <Route path='/post-job' element={<JobPostingForm/>}/>
              <Route path='/manage-jobs' element={<ManageJobs/>}/>
              <Route path='/applicants' element={<ApplicationViewer/>}/>
              <Route path='/company-profile' element={<EmployerProfilePage/>}/>
              <Route path='/edit-company-profile' element={<EditProfileDetails/>}/>
              <Route path='/applicant/:userId' element={<JobSeekerProfileView/>}/>
            </Route>
            <Route path='/edit-profile' element={<EditJobSeekerProfile/>}/>
            <Route path='*' element={<Navigate to='/' replace/>}/>
          </Routes>
        </BrowserRouter>
        <Toaster toastOptions={{className:"", style:{fontSize: "13px",},
      }}/>
    </div>
  );
}

export default App;