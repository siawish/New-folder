// Admin Dashboard JavaScript
// Initialize supabase client from the global variable
const supabaseClient = window.supabaseClient;

// Global chart objects
let patientOverviewChart;
let revenueChart;

// Content sections - used for navigation
const contentSections = [
    'dashboard',
    'appointments',
    'patients',
    'doctors',
    'departments',
    'receptionists',
    'reports',
    'settings'
];

// Update admin info in the UI
const updateAdminInfo = (profile) => {
    const adminNameElements = document.querySelectorAll('#admin-name, #admin-header-name');
    adminNameElements.forEach(el => {
        if (el) el.textContent = `${profile.first_name} ${profile.last_name}`;
    });
    
    // Update avatar if available
    const avatarElement = document.getElementById('admin-avatar');
    if (avatarElement && profile.profile_image_url) {
        avatarElement.src = profile.profile_image_url;
    }
    
    // Update role display
    const adminRoleElement = document.getElementById('admin-role');
    if (adminRoleElement) {
        adminRoleElement.textContent = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
    }
};

// Handle navigation between different sections
const handleNavigation = () => {
    // Get all sidebar navigation links
    const navLinks = document.querySelectorAll('.sidebar-item');
    
    // Function to show a specific section and hide others
    handleNavigation.showSection = (sectionId) => {
        // Remove 'active' class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add 'active' class to the clicked link
        const activeLink = document.querySelector(`.sidebar-item[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Hide all content sections
        contentSections.forEach(section => {
            const sectionElement = document.getElementById(`${section}-content`);
            if (sectionElement) {
                sectionElement.classList.add('hidden');
            }
        });
        
        // Show the selected section
        const selectedSection = document.getElementById(`${sectionId}-content`);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }
        
        // Save the current section to localStorage
        localStorage.setItem('hms-active-section', sectionId);
    };
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1); // Remove the # from href
            handleNavigation.showSection(sectionId);
        });
    });
    
    // Check if there's a hash in the URL on page load
    const hash = window.location.hash.substring(1);
    if (hash && contentSections.includes(hash)) {
        handleNavigation.showSection(hash);
    } else {
        // Check if there's a saved section in localStorage
        const savedSection = localStorage.getItem('hms-active-section');
        if (savedSection && contentSections.includes(savedSection)) {
            handleNavigation.showSection(savedSection);
        } else {
            // Default to dashboard
            handleNavigation.showSection('dashboard');
        }
    }
    
    // Listen for hash changes in the URL
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && contentSections.includes(newHash)) {
            handleNavigation.showSection(newHash);
        }
    });
};

// Check if user is logged in and is an admin
const checkAdminAccess = async () => {
    try {
        // Check for default admin session in localStorage
        const isDefaultAdmin = localStorage.getItem('isDefaultAdmin') === 'true';
        
        if (isDefaultAdmin) {
            console.log('Using default admin session');
            // Set a default profile for UI updates
            updateAdminInfo({
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin'
            });
            return true; // Allow access for default admin
        }
        
        // Otherwise check Supabase authentication
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (!user) {
            console.log('No user found, redirecting to login');
            window.location.href = '../../auth/login.html';
            return false;
        }
        
        // Get user profile to check role
        const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
        
        console.log('Profile found:', profile);
        
        if (!profile || profile.role !== 'admin') {
            console.log('User is not an admin, redirecting');
            alert('You do not have permission to access the admin dashboard.');
            window.location.href = '../../index.html';
            return false;
        }
        
        // Update admin name in the UI
        updateAdminInfo(profile);
        return true;
    } catch (error) {
        console.error('Error checking admin access:', error);
        alert('An error occurred. Please try again.');
        return false;
    }
};

// Fetch dashboard statistics
const fetchDashboardStats = async () => {
    console.log('Fetching dashboard statistics from database...');
    
    // Initialize count variables
    let patientCount = 0;
    let doctorCount = 0;
    let appointmentCount = 0;
    let pendingAppointmentCount = 0;
    let roomCount = 0;
    let totalRevenue = 0;
    
    try {
        // Check if HMSDatabase is available
        if (window.HMSDatabase && window.HMSDatabase.getDashboardStats) {
            console.log('Using HMSDatabase to get real data...');
            try {
                const stats = await window.HMSDatabase.getDashboardStats();
                console.log('Dashboard statistics received:', stats);
                
                // Update UI with real data
                if (stats) {
                    // Safely update UI elements with null checks
                    const updateElement = (id, value) => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.textContent = value;
                        } else {
                            // Use console.debug instead of console.log to reduce noise in the console
                            console.debug(`Element with id '${id}' not found`);
                        }
                    };
                    
                    // Update only elements that exist in the HTML
                    // Core statistics
                    updateElement('total-patients', stats.patientCount);
                    updateElement('total-doctors', stats.doctorCount);
                    updateElement('total-appointments', stats.appointmentCount);
                    updateElement('total-bedrooms', stats.bedroomCount || 0);
                    
                    // Optional elements that might not exist in all dashboard versions
                    if (document.getElementById('pending-appointments')) {
                        updateElement('pending-appointments', stats.pendingAppointmentCount);
                    }
                    
                    // Format currency values
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                    
                    // Update financial elements if they exist
                    if (stats.financials) {
                        if (stats.financials.totalRevenue !== undefined && document.getElementById('total-revenue')) {
                            updateElement('total-revenue', formatter.format(stats.financials.totalRevenue));
                        }
                        
                        if (stats.financials.totalPending !== undefined && document.getElementById('pending-amount')) {
                            updateElement('pending-amount', formatter.format(stats.financials.totalPending));
                        }
                        
                        // Update monthly revenue if it exists
                        if (stats.financials.monthlyRevenue !== undefined && document.getElementById('monthly-revenue')) {
                            updateElement('monthly-revenue', formatter.format(stats.financials.monthlyRevenue));
                        }
                    }
                    
                    // Also fetch recent patients for chart data
                    await fetchPatientData();
                    return;
                }
            } catch (dbError) {
                console.error('Error using HMSDatabase:', dbError);
                // Fall back to original method
            }
        }
        
        // Fetch patient count
        try {
            const { count, error } = await supabaseClient
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('role', 'patient');
                
            if (error) {
                console.error('Error fetching patient count:', error);
            } else {
                patientCount = count || 0;
                console.log('Patient count fetched successfully:', patientCount);
            }
        } catch (error) {
            console.error('Exception fetching patient count:', error);
        }
        
        // Fetch doctor count
        try {
            const { count, error } = await supabaseClient
                .from('profiles')
                .select('id', { count: 'exact', head: true })
                .eq('role', 'doctor');
                
            if (error) {
                console.error('Error fetching doctor count:', error);
            } else {
                doctorCount = count || 0;
                console.log('Doctor count fetched successfully:', doctorCount);
            }
        } catch (error) {
            console.error('Exception fetching doctor count:', error);
        }
        
        // Fetch appointment count
        try {
            const { count, error } = await supabaseClient
                .from('appointments')
                .select('id', { count: 'exact', head: true });
                
            if (error) {
                console.error('Error fetching appointment count:', error);
            } else {
                appointmentCount = count || 0;
                console.log('Appointment count fetched successfully:', appointmentCount);
            }
        } catch (error) {
            console.error('Exception fetching appointment count:', error);
        }
        
        // Fetch pending appointment count
        try {
            const { count, error } = await supabaseClient
                .from('appointments')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'scheduled');
                
            if (error) {
                console.error('Error fetching pending appointment count:', error);
            } else {
                pendingAppointmentCount = count || 0;
                console.log('Pending appointment count fetched successfully:', pendingAppointmentCount);
            }
        } catch (error) {
            console.error('Exception fetching pending appointment count:', error);
        }
        
        // Fetch bedroom count (if table exists)
        try {
            const { count, error } = await supabaseClient
                .from('bedrooms')
                .select('id', { count: 'exact', head: true });
                
            if (error) {
                console.error('Error fetching bedroom count:', error);
            } else {
                roomCount = count || 0;
                console.log('Bedroom count fetched successfully:', roomCount);
            }
        } catch (error) {
            console.error('Exception fetching bedroom count (table may not exist):', error);
        }
        
        // Fetch revenue data
        try {
            const { data, error } = await supabaseClient
                .from('invoices')
                .select('total_amount');
                
            if (error) {
                console.error('Error fetching invoice data:', error);
            } else if (data) {
                totalRevenue = data.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
                console.log('Revenue calculated successfully:', totalRevenue);
            }
        } catch (error) {
            console.error('Exception fetching invoice data (table may not exist):', error);
        }
        
        // Format numbers for display
        updateElement('total-appointments', formatNumber(appointmentCount));
        updateElement('pending-appointments', formatNumber(pendingAppointmentCount));
        
        // Update revenue if element exists
        updateElement('total-revenue', `$${formatNumber(totalRevenue)}`);
        
        console.log('Dashboard statistics updated with available data');
    } catch (mainError) {
        console.error('Error in fetchDashboardStats:', mainError);
    }
};

// Fetch recent patient data for charts
const fetchPatientData = async () => {
    try {
        // Get recent patients for the patient overview chart
        const { data: recentPatients, error } = await supabaseClient
            .from('profiles')
            .select('created_at')
            .eq('role', 'patient')
            .order('created_at', { ascending: false })
            .limit(30);

            
        if (error) throw error;
        
        console.log('Recent patients data:', recentPatients);
        
        // Process the data for the chart
        // Group by date for the last 7 days
        const today = new Date();
        const last7Days = Array.from({length: 8}, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (7 - i));
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        });
        
        // Count patients per day
        const patientsByDay = {};
        last7Days.forEach(day => patientsByDay[day] = 0);
        
        // If we have real data, use it
        if (recentPatients && recentPatients.length > 0) {
            recentPatients.forEach(patient => {
                const day = new Date(patient.created_at).toISOString().split('T')[0];
                if (patientsByDay[day] !== undefined) {
                    patientsByDay[day]++;
                }
            });
        } else {
            // No sample data - use zeros if no real data exists
            console.log('No patient data found, using zeros');
            last7Days.forEach(day => patientsByDay[day] = 0);
        }
        
        // Update the chart with this data
        updatePatientOverviewChart(last7Days, Object.values(patientsByDay));
        
    } catch (error) {
        console.error('Error fetching patient data:', error);
        // No mock data in error case - just show zeros
        const today = new Date();
        const labels = Array.from({length: 8}, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (7 - i));
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        });
        const data = Array(8).fill(0);
        updatePatientOverviewChart(labels, data);
    }
};

// Function to fetch doctor schedules
const fetchDoctorSchedules = async () => {
    try {
        // First check if the profiles table has a specialty column
        let selectQuery = 'id, first_name, last_name';
        
        try {
            // Try to get specialty column, but don't fail if it doesn't exist
            const { data: doctorTest, error: testError } = await supabaseClient
                .from('profiles')
                .select('specialty')
                .eq('role', 'doctor')
                .limit(1);
                
            // If no error, we can include specialty in our main query
            if (!testError) {
                selectQuery = 'id, first_name, last_name, specialty';
            }
        } catch (e) {
            console.log('Specialty column not available:', e);
        }
        
        const { data: doctors, error } = await supabaseClient
            .from('profiles')
            .select(selectQuery)
            .eq('role', 'doctor')
            .limit(5);
        
        if (error) throw error;
        
        const scheduleContainer = document.getElementById('doctor-schedules');
        if (!scheduleContainer) return;
        
        // Clear existing content
        scheduleContainer.innerHTML = '';
        
        if (doctors && doctors.length > 0) {
            doctors.forEach(doctor => {
                // Create a random schedule for demo purposes
                const startHour = 8 + Math.floor(Math.random() * 4); // 8 AM to 11 AM
                const endHour = startHour + 6 + Math.floor(Math.random() * 3); // 6-8 hours later
                
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'flex items-center justify-between p-3 border-b hover:bg-gray-50';
                scheduleItem.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            ${doctor.first_name.charAt(0)}${doctor.last_name.charAt(0)}
                        </div>
                        <div class="ml-3">
                            <p class="font-medium">${doctor.first_name} ${doctor.last_name}</p>
                            <p class="text-sm text-gray-500">${doctor.specialty || 'General Physician'}</p>
                        </div>
                    </div>
                    <div class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        ${startHour}:00 AM - ${endHour > 12 ? (endHour - 12) : endHour}:00 ${endHour >= 12 ? 'PM' : 'AM'}
                    </div>
                `;
                
                scheduleContainer.appendChild(scheduleItem);
            });
        } else {
            // Show placeholder data if no doctors found
            scheduleContainer.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    No doctor schedules available
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching doctor schedules:', error);
        // Show error message
        const scheduleContainer = document.getElementById('doctor-schedules');
        if (scheduleContainer) {
            scheduleContainer.innerHTML = `
                <div class="p-4 text-center text-red-500">
                    Error loading doctor schedules
                </div>
            `;
        }
    }
};

// Initialize patient overview chart
const initPatientOverviewChart = () => {
    const ctx = document.getElementById('patient-overview-chart');
    if (!ctx) {
        console.log('Patient overview chart element not found');
        return;
    }
    
    // Default data - will be replaced with real data from fetchPatientData
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(labels.length).fill(0); // Initialize with zeros instead of sample data
    
    patientOverviewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Patients',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    titleFont: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
};

// Initialize patient demographics chart by department
const initPatientAgeDistributionChart = async (patients) => {
    // Try different possible IDs for the chart element
    const possibleChartIds = ['patient-age-distribution-chart', 'patientDemographicsChart', 'patient-demographics-chart'];
    let ctx = null;
    
    // Try to find the chart element with any of the possible IDs
    for (const id of possibleChartIds) {
        const element = document.getElementById(id);
        if (element) {
            ctx = element;
            break;
        }
    }
    
    if (!ctx) {
        console.debug('Patient demographics chart element not found');
        return;
    }
    
    // Get departments from the database
    let departments = [];
    try {
        const { data: deptData, error } = await supabaseClient
            .from('departments')
            .select('id, name');
            
        if (!error && deptData && deptData.length > 0) {
            departments = deptData;
        } else {
            console.log('No departments found in database');
        }
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
    
    // Process patient data to get distribution by department
    const departmentCounts = {};
    
    // Initialize department counts
    if (departments.length > 0) {
        departments.forEach(dept => {
            departmentCounts[dept.name] = 0;
        });
    } else {
        // Default departments if none found in database
        departmentCounts['Cardiology'] = 0;
        departmentCounts['Neurology'] = 0;
        departmentCounts['Pediatrics'] = 0;
        departmentCounts['Orthopedics'] = 0;
        departmentCounts['General'] = 0;
    }
    
    // Count patients by department
    if (patients && patients.length > 0) {
        patients.forEach(patient => {
            if (patient.department_id) {
                // Find department name from ID
                const department = departments.find(d => d.id === patient.department_id);
                if (department && department.name) {
                    departmentCounts[department.name]++;
                } else {
                    // If department not found, add to General
                    if (departmentCounts['General'] !== undefined) {
                        departmentCounts['General']++;
                    }
                }
            } else if (patient.department) {
                // If department name is directly available
                if (departmentCounts[patient.department] !== undefined) {
                    departmentCounts[patient.department]++;
                } else {
                    // If department not in our list, add to General
                    if (departmentCounts['General'] !== undefined) {
                        departmentCounts['General']++;
                    }
                }
            }
        });
    }
    
    // Create or update chart
    if (window.ageDistributionChart) {
        window.ageDistributionChart.destroy();
    }
    
    window.ageDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(departmentCounts),
            datasets: [{
                data: Object.values(departmentCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',   // Blue - Cardiology
                    'rgba(16, 185, 129, 0.7)',  // Green - Neurology
                    'rgba(245, 158, 11, 0.7)',  // Yellow - Pediatrics
                    'rgba(239, 68, 68, 0.7)',   // Red - Orthopedics
                    'rgba(139, 92, 246, 0.7)'   // Purple - General
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const label = context.label;
                            return `${label}: ${value} patients`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
};

// Update patient overview chart with new data
const updatePatientOverviewChart = (labels, data) => {
    if (!patientOverviewChart) {
        initPatientOverviewChart();
    }
    
    if (patientOverviewChart) {
        patientOverviewChart.data.labels = labels;
        patientOverviewChart.data.datasets[0].data = data;
        patientOverviewChart.update();
    }
};

// Fetch revenue data from the database
const fetchRevenueData = async () => {
    try {
        console.log('Fetching revenue data from database...');
        let revenueData = [];
        let labels = [];
        
        // First check what columns are available in the invoices table
        try {
            // Try a simple select to see what columns are available
            const { data: invoiceTest, error: testError } = await supabaseClient
                .from('invoices')
                .select('*')
                .limit(1);
                
            if (!testError && invoiceTest && invoiceTest.length > 0) {
                // Table exists, now determine which columns to use
                const hasAmount = invoiceTest[0] && 'amount' in invoiceTest[0];
                const hasTotalAmount = invoiceTest[0] && 'total_amount' in invoiceTest[0];
                
                // Determine which column to use for amount
                const amountColumn = hasAmount ? 'amount' : (hasTotalAmount ? 'total_amount' : 'total_amount');
                
                // Fetch revenue data with the right columns
                const { data: invoices, error } = await supabaseClient
                    .from('invoices')
                    .select(`created_at, ${amountColumn}`)
                    .order('created_at');
                    
                if (!error && invoices && invoices.length > 0) {
                    console.log('Found invoice data:', invoices.length, 'records');
                    
                    // Group by month
                    const revenueByMonth = {};
                    
                    invoices.forEach(invoice => {
                        const date = new Date(invoice.created_at);
                        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
                        
                        if (!revenueByMonth[monthYear]) {
                            revenueByMonth[monthYear] = 0;
                        }
                        
                        revenueByMonth[monthYear] += parseFloat(invoice[amountColumn]) || 0;
                    });
                    
                    // Convert to arrays for the chart
                    labels = Object.keys(revenueByMonth);
                    revenueData = Object.values(revenueByMonth);
                } else {
                    // No invoice data found
                    console.log('No invoice data found in database');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    labels = months;
                    revenueData = Array(months.length).fill(0); // Empty data
                }
            } else {
                // Table doesn't exist or is empty
                console.log('Invoices table not found or empty');
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                labels = months;
                revenueData = Array(months.length).fill(0); // Empty data
            }
        } catch (innerError) {
            console.log('Error checking invoices table:', innerError);
            // Empty data if there's an error
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            labels = months;
            revenueData = Array(months.length).fill(0); // Empty data
        }
        
        // Update the chart
        if (revenueChart) {
            revenueChart.data.labels = labels;
            revenueChart.data.datasets[0].data = revenueData;
            revenueChart.update();
        } else {
            initRevenueChart(labels, revenueData);
        }
        
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        // Initialize with empty data if there's an error
        if (!revenueChart) {
            initRevenueChart([], []);
        }
    }
};

// Initialize revenue chart
const initRevenueChart = (labels = [], data = []) => {
    // Try both possible IDs (with and without dashes)
    const ctx = document.getElementById('revenue-chart') || document.getElementById('revenueChart');
    if (!ctx) {
        console.warn('Revenue chart element not found');
        return;
    }
    
    try {
        revenueChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing revenue chart:', error);
    }
};

// Mobile menu toggle
const setupMobileMenu = () => {
    console.log('Setting up mobile menu toggle...');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');
    
    if (mobileMenuToggle && sidebar) {
        console.log('Mobile menu elements found, attaching event listener');
        // Remove any existing event listeners to prevent duplicates
        mobileMenuToggle.removeEventListener('click', toggleMobileMenu);
        
        // Define the toggle function
        function toggleMobileMenu() {
            console.log('Mobile menu toggle clicked');
            // Toggle sidebar visibility
            sidebar.classList.toggle('-translate-x-full');
            
            // Toggle between open and close icons
            menuOpenIcon.classList.toggle('hidden');
            menuCloseIcon.classList.toggle('hidden');
            
            // Add/remove overlay when sidebar is open
            if (!sidebar.classList.contains('-translate-x-full')) {
                // Create overlay if it doesn't exist
                if (!document.getElementById('sidebar-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.id = 'sidebar-overlay';
                    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden';
                    document.body.appendChild(overlay);
                    
                    // Close sidebar when overlay is clicked
                    overlay.addEventListener('click', () => {
                        sidebar.classList.add('-translate-x-full');
                        menuOpenIcon.classList.remove('hidden');
                        menuCloseIcon.classList.add('hidden');
                        overlay.remove();
                    });
                }
            } else {
                // Remove overlay when sidebar is closed
                const overlay = document.getElementById('sidebar-overlay');
                if (overlay) overlay.remove();
            }
        }
        
        // Add the event listener
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Also add a direct click handler to ensure it works
        mobileMenuToggle.onclick = toggleMobileMenu;
    } else {
        console.warn('Mobile menu elements not found:', { 
            mobileMenuToggle: !!mobileMenuToggle, 
            sidebar: !!sidebar,
            menuOpenIcon: !!menuOpenIcon,
            menuCloseIcon: !!menuCloseIcon
        });
    }

};

// Fetch billing data for the dashboard
const fetchBillingData = async () => {
    try {
        console.log('Fetching billing data from database...');
        
        // First check if invoices table exists and what columns it has
        let invoices = [];
        let payments = [];
        
        try {
            // Try a simple select to see what columns are available
            const { data: invoiceTest, error: testError } = await supabaseClient
                .from('invoices')
                .select('*')
                .limit(1);
                
            if (!testError && invoiceTest && invoiceTest.length > 0) {
                // Table exists, now fetch with the right columns
                const hasAmount = invoiceTest[0] && 'amount' in invoiceTest[0];
                const hasTotalAmount = invoiceTest[0] && 'total_amount' in invoiceTest[0];
                
                // Determine which column to use for amount
                const amountColumn = hasAmount ? 'amount' : (hasTotalAmount ? 'total_amount' : 'total_amount');
                
                // Fetch recent invoices with the right columns
                const { data, error } = await supabaseClient
                    .from('invoices')
                    .select(`id, created_at, ${amountColumn}, status`)
                    .order('created_at', { ascending: false })
                    .limit(5);
                    
                if (!error && data) {
                    invoices = data.map(invoice => ({
                        id: invoice.id,
                        date: new Date(invoice.created_at).toLocaleDateString(),
                        amount: invoice[amountColumn] || 0,
                        status: invoice.status || 'Pending'
                    }));
                }
            }
        } catch (invoiceError) {
            console.log('Error querying invoices table:', invoiceError);
        }
        
        try {
            // Try to fetch payments if the table exists
            const { data, error } = await supabaseClient
                .from('payments')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
                
            if (!error && data) {
                payments = data.map(payment => ({
                    id: payment.id,
                    date: new Date(payment.created_at).toLocaleDateString(),
                    amount: payment.amount || 0,
                    method: payment.payment_method || 'Unknown'
                }));
            }
        } catch (paymentError) {
            console.log('Error querying payments table:', paymentError);
        }
        
        // Update the UI with the fetched data
        updateBillingUI(invoices, payments);
        
    } catch (error) {
        console.error('Error fetching billing data:', error);
        
        // Show error message in the UI
        updateBillingUI([], []);
    }
};

// Update the UI with billing data
const updateBillingUI = (invoices, payments) => {
    try {
        // Update recent invoices table if it exists
        const invoicesTable = document.getElementById('recent-invoices-table');
        if (invoicesTable) {
            const tbody = invoicesTable.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = '';
                
                if (invoices && invoices.length > 0) {
                    invoices.forEach(invoice => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="px-4 py-3">#${invoice.id}</td>
                            <td class="px-4 py-3">${invoice.date}</td>
                            <td class="px-4 py-3">$${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : invoice.amount}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 text-xs rounded-full ${invoice.status && invoice.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${invoice.status || 'Pending'}
                                </span>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="4" class="px-4 py-3 text-center text-gray-500">No invoices found</td>
                    `;
                    tbody.appendChild(row);
                }
            }
        }
        
        // Update payments table if it exists
        const paymentsTable = document.getElementById('recent-payments-table');
        if (paymentsTable) {
            const tbody = paymentsTable.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = '';
                
                if (payments && payments.length > 0) {
                    payments.forEach(payment => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="px-4 py-3">#${payment.id}</td>
                            <td class="px-4 py-3">${payment.date}</td>
                            <td class="px-4 py-3">$${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    ${payment.method || 'Other'}
                                </span>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="4" class="px-4 py-3 text-center text-gray-500">No payments found</td>
                    `;
                    tbody.appendChild(row);
                }
            }
        }
    } catch (error) {
        console.error('Error updating billing UI:', error);
    }
};

// Fetch medical records data for dashboard display
const dashboard_fetchMedicalRecords = async () => {
    try {
        console.log('Fetching medical records from database...');
        
        const { data: records, error } = await supabaseClient
            .from('medical_records')
            .select('id, patient_id, doctor_id, diagnosis, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (error) throw error;
        
        // Update medical records UI if it exists
        const recordsContainer = document.getElementById('recent-medical-records');
        if (recordsContainer) {
            recordsContainer.innerHTML = '';
            
            if (records && records.length > 0) {
                // Get all patient IDs
                const patientIds = [...new Set(records.map(record => record.patient_id))];
                
                // Fetch patient profiles
                const { data: patients, error: patientsError } = await supabaseClient
                    .from('profiles')
                    .select('id, first_name, last_name')
                    .in('id', patientIds);
                    
                if (patientsError) throw patientsError;
                
                // Create a map of patient IDs to names
                const patientMap = {};
                if (patients) {
                    patients.forEach(patient => {
                        patientMap[patient.id] = `${patient.first_name} ${patient.last_name}`;
                    });
                }
                
                // Add each record to the container
                records.forEach(record => {
                    const recordElement = document.createElement('div');
                    recordElement.className = 'bg-white rounded-lg shadow-md p-4 mb-3';
                    recordElement.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-semibold">${patientMap[record.patient_id] || 'Unknown Patient'}</h4>
                            <span class="text-xs text-gray-500">${new Date(record.created_at).toLocaleDateString()}</span>
                        </div>
                        <p class="text-xs text-gray-700 truncate">${record.diagnosis || 'No diagnosis recorded'}</p>
                    `;
                    recordsContainer.appendChild(recordElement);
                });
            } else {
                recordsContainer.innerHTML = `
                    <div class="p-4 text-center text-gray-500">
                        No medical records found
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error fetching medical records:', error);
        
        // Show error message
        const recordsContainer = document.getElementById('recent-medical-records');
        if (recordsContainer) {
            recordsContainer.innerHTML = `
                <div class="p-4 text-center text-red-500">
                    Error loading medical records
                </div>
            `;
        }
    }
};

// Function to fetch doctors from the database
const fetchDoctorsData = async () => {
    const doctorsTableBody = document.getElementById('doctors-table-body');
    if (!doctorsTableBody) return;
    try {
        showLoadingState('doctors-table-body', 'Loading doctors...');
        
        // Fetch doctors from Supabase
        const { data: doctors, error } = await supabaseClient
            .from('doctors')
            .select('id, specialization, license_number, qualification, experience_years, consultation_fee, department, profiles (id, first_name, last_name, email, phone)');

        if (error) {
            console.error('Error fetching doctors:', error);
            showErrorState('doctors-table-body', 'Failed to load doctors. Please try again.');
            return;
        }

        // Get pending doctors from localStorage (for the count badge)
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        
        // Update the pending doctors count badge
        if (typeof updatePendingDoctorsCount === 'function') {
            updatePendingDoctorsCount();
        }
        
        const doctorsTableBody = document.getElementById('doctors-table-body');
        doctorsTableBody.innerHTML = '';

        if (doctors.length === 0) {
            doctorsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-3 text-center text-gray-500">
                        No active doctors found. Add your first doctor!
                    </td>
                </tr>
            `;
            return;
        }

        // Display active doctors from Supabase
        doctors.forEach(doctor => {
            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50');
            
            const profile = doctor.profiles;
            if (!profile) return; // Skip if no profile data
            
            tr.innerHTML = `
                <td class="px-4 py-3">${profile.first_name} ${profile.last_name}</td>
                <td class="px-4 py-3">${profile.email}</td>
                <td class="px-4 py-3">${profile.phone || '-'}</td>
                <td class="px-4 py-3">${doctor.specialization || '-'}</td>
                <td class="px-4 py-3">${doctor.department || '-'}</td>
                <td class="px-4 py-3">
                    <button class="text-blue-500 hover:text-blue-700 mr-2 edit-doctor" 
                            data-id="${doctor.id}" data-source="supabase">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="text-red-500 hover:text-red-700 delete-doctor" 
                            data-id="${doctor.id}" data-source="supabase">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            doctorsTableBody.appendChild(tr);
        });

        // Add event listeners for the active doctors buttons
        document.querySelectorAll('.edit-doctor').forEach(button => {
            button.addEventListener('click', () => {
                const doctorId = button.getAttribute('data-id');
                const source = button.getAttribute('data-source');
                editDoctor(doctorId, source);
            });
        });
        
        document.querySelectorAll('.delete-doctor').forEach(button => {
            button.addEventListener('click', () => {
                const doctorId = button.getAttribute('data-id');
                const source = button.getAttribute('data-source');
                deleteDoctor(doctorId, source);
            });
        });
        
        // Also refresh the pending doctors table if the function is available
        if (typeof refreshPendingDoctorsTable === 'function') {
            refreshPendingDoctorsTable();
        }

    } catch (error) {
        console.error('Error in fetchDoctorsData:', error);
        showErrorState('doctors-table-body', 'An unexpected error occurred. Please try again.');
    }
};
// Function to populate department dropdown
const populateDepartmentDropdown = async () => {
    const departmentSelect = document.getElementById('department');
    if (!departmentSelect) return;
    
    // Clear existing options except the first one
    while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
    }
    
    // Fetch departments
    const departments = await getDepartmentsForDoctorForm();
    
    // Add departments to dropdown
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentSelect.appendChild(option);
    });
};

// Function is kept for backward compatibility but functionality has been moved to registration.js
const setupAddDoctorFunctionality = () => {
    console.log('Doctor registration functionality has been moved to registration.html');
    // This function is no longer used - registration is now handled in registration.js
};


const initDashboard = async () => {
    try {
        console.log('Dashboard loaded, checking auth...');
        console.log('Checking if HMSDatabase is available:', !!window.HMSDatabase);
        
        // Check if user is logged in and has admin access
        await checkAdminAccess();
        
        // Initialize navigation
        handleNavigation();
        
        // Initialize charts
        initPatientOverviewChart();
        
        // Fetch real data from the database
        console.log('Fetching real data from the database...');
        fetchDashboardStats();
        fetchPatientData();
        fetchRevenueData();
        fetchDoctorSchedules();
        fetchBillingData();
        dashboard_fetchMedicalRecords();
                    // Add to the initDashboard function before the closing brace
        // Setup reports functionality
        setupReportsTabs();
        fetchPatientReportData(); // Load patient report by default
        // Setup mobile menu
        setupMobileMenu();
        // Initialize calendar
        initCalendar();
        
        // Make the dashboard responsive
        window.addEventListener('resize', () => {
            if (patientOverviewChart) {
                patientOverviewChart.resize();
            }
            if (revenueChart) {
                revenueChart.resize();
            }
        });
        
        // Add event listener for doctors tab
        const doctorsLink = document.querySelector('.sidebar-item[href="#doctors"]');
        if (doctorsLink) {
            doctorsLink.addEventListener('click', fetchDoctorsData);
        }
        
        // Setup add doctor button to show registration modal
        // Function to show doctor registration modal
        const showDoctorRegistrationModal = () => {
            console.log('Add doctor button clicked - showing registration modal');
            // Show the registration modal
            const registrationModal = document.getElementById('registration-modal');
            const modalTitle = document.getElementById('registration-modal-title');
            
            if (registrationModal && modalTitle) {
                // Set the modal title
                modalTitle.textContent = 'Doctor Registration';
                
                // Show the modal
                registrationModal.classList.remove('hidden');
                
                // Initialize doctor registration
                if (typeof doctorRegistration !== 'undefined') {
                    doctorRegistration.initRegistration();
                } else {
                    console.error('Doctor registration strategy not found');
                    document.getElementById('registration-form-container').innerHTML = 
                        '<p class="text-center text-red-500">Error: Doctor registration module not loaded.</p>';
                }
            }
        };
        
        // Setup both Add Doctor buttons
        const addDoctorBtn = document.getElementById('add-doctor-btn');
        if (addDoctorBtn) {
            console.log('Setting up main add doctor button');
            addDoctorBtn.addEventListener('click', showDoctorRegistrationModal);
        }
        
        const addDoctorBtnAlt = document.getElementById('add-doctor-btn-alt');
        if (addDoctorBtnAlt) {
            console.log('Setting up alternative add doctor button');
            addDoctorBtnAlt.addEventListener('click', showDoctorRegistrationModal);
        }
        
        // Setup registration modal close button
        const closeRegistrationModalBtn = document.getElementById('close-registration-modal');
        if (closeRegistrationModalBtn) {
            closeRegistrationModalBtn.addEventListener('click', () => {
                const registrationModal = document.getElementById('registration-modal');
                if (registrationModal) {
                    registrationModal.classList.add('hidden');
                    // Reset the form container
                    const formContainer = document.getElementById('registration-form-container');
                    if (formContainer) {
                        formContainer.innerHTML = '<p class="text-center text-gray-500">Loading registration form...</p>';
                    }
                    // Hide progress steps
                    const progressSteps = document.getElementById('progress-steps');
                    if (progressSteps) {
                        progressSteps.classList.add('hidden');
                    }
                }
            });
        }
        
        // Setup add receptionist button to show registration modal
        const addReceptionistBtn = document.getElementById('add-receptionist-btn');
        if (addReceptionistBtn) {
            console.log('Setting up add receptionist button to show registration modal');
            addReceptionistBtn.addEventListener('click', () => {
                console.log('Add receptionist button clicked - showing registration modal');
                // Show the registration modal
                const registrationModal = document.getElementById('registration-modal');
                const modalTitle = document.getElementById('registration-modal-title');
                
                if (registrationModal && modalTitle) {
                    // Set the modal title
                    modalTitle.textContent = 'Receptionist Registration';
                    
                    // Show the modal
                    registrationModal.classList.remove('hidden');
                    
                    // Initialize receptionist registration
                    if (typeof receptionistRegistration !== 'undefined') {
                        receptionistRegistration.initRegistration();
                    } else {
                        console.error('Receptionist registration strategy not found');
                        document.getElementById('registration-form-container').innerHTML = 
                            '<p class="text-center text-red-500">Error: Receptionist registration module not loaded.</p>';
                    }
                }
            });
        }
        
        // Setup add patient button to show registration modal
        const addPatientBtn = document.getElementById('add-patient-btn');
        if (addPatientBtn) {
            console.log('Setting up add patient button to show registration modal');
            addPatientBtn.addEventListener('click', () => {
                console.log('Add patient button clicked - showing registration modal');
                // Show the registration modal
                const registrationModal = document.getElementById('registration-modal');
                const modalTitle = document.getElementById('registration-modal-title');
                
                if (registrationModal && modalTitle) {
                    // Set the modal title
                    modalTitle.textContent = 'Patient Registration';
                    
                    // Show the modal
                    registrationModal.classList.remove('hidden');
                    
                    // Initialize patient registration
                    if (typeof patientRegistration !== 'undefined') {
                        patientRegistration.initRegistration();
                    } else {
                        console.error('Patient registration strategy not found');
                        document.getElementById('registration-form-container').innerHTML = 
                            '<p class="text-center text-red-500">Error: Patient registration module not loaded.</p>';
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
};

// Setup logout functionality
const setupLogout = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                localStorage.removeItem('isDefaultAdmin');
                await supabaseClient.auth.signOut();
                window.location.href = '../../index.html';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('An error occurred while signing out. Please try again.');
            }
        });
    }
};

// This section has been removed as requested

// Initialize calendar for the dashboard
const initCalendar = () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonthTitle = document.getElementById('calendar-month-title')?.querySelector('span');
    const prevMonthBtn = document.getElementById('calendar-prev-month');
    const nextMonthBtn = document.getElementById('calendar-next-month');
    const todayBtn = document.getElementById('calendar-today');
    
    if (!calendarGrid || !calendarMonthTitle) {
        console.debug('Calendar elements not found');
        return;
    }
    
    // Current date tracking
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Function to render the calendar
    const renderCalendar = async () => {
        // Clear the grid
        calendarGrid.innerHTML = '';
        
        // Update the month title
        const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
        calendarMonthTitle.textContent = `${monthName} ${currentYear}`;
        
        // Get the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        
        // Get the number of days in the month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Get the current day
        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
        const currentDay = today.getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'text-gray-300 p-2';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Try to fetch appointments for this month
        let appointments = [];
        try {
            // Check if appointments table exists
            let tableExists = false;
            try {
                // Try a minimal query to check if table exists
                const { error: checkError } = await supabaseClient
                    .from('appointments')
                    .select('count', { count: 'exact', head: true });
                    
                tableExists = !checkError;
            } catch (checkErr) {
                console.debug('Appointments table does not exist:', checkErr);
                tableExists = false;
            }
            
            if (tableExists) {
                const startDate = new Date(currentYear, currentMonth, 1).toISOString();
                const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString();
                
                // Use proper filter format for Supabase and handle date format correctly
                // Convert dates to YYYY-MM-DD format for database query
                const startDateStr = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
                const endDateStr = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
                
                const { data, error } = await supabaseClient
                    .from('appointments')
                    .select('*')
                    .gte('date', startDateStr)
                    .lte('date', endDateStr);
                    
                if (!error && data) {
                    appointments = data;
                    console.log(`Fetched ${appointments.length} appointments for ${monthName}`);
                } else if (error) {
                    console.error('Error fetching appointments:', error);
                }
            } else {
                console.log('Appointments table not found, showing empty calendar');
            }
        } catch (error) {
            console.error('Error fetching appointments for calendar:', error);
        }
        
        // Create a map of appointment counts by day
        const appointmentsByDay = {};
        appointments.forEach(appointment => {
            const date = new Date(appointment.appointment_date).getDate();
            appointmentsByDay[date] = (appointmentsByDay[date] || 0) + 1;
        });
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'relative p-2 hover:bg-gray-50 cursor-pointer transition-colors rounded';
            
            // Check if this is today
            if (isCurrentMonth && day === currentDay) {
                dayCell.className += ' bg-blue-50 font-bold text-blue-600 border border-blue-200';
            }
            
            // Add the day number
            dayCell.innerHTML = `<span>${day}</span>`;
            
            // Add appointment indicator if there are appointments on this day
            if (appointmentsByDay[day]) {
                const indicator = document.createElement('div');
                indicator.className = 'absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full';
                dayCell.appendChild(indicator);
                
                // Add tooltip with appointment count
                dayCell.setAttribute('title', `${appointmentsByDay[day]} appointment(s)`);
            }
            
            // Add click event to show appointments for this day
            dayCell.addEventListener('click', () => {
                const clickedDate = new Date(currentYear, currentMonth, day);
                showDaySchedule(clickedDate, appointmentsByDay[day] || 0);
            });
            
            calendarGrid.appendChild(dayCell);
        }
    };
    
    // Function to show the schedule for a selected day
    const showDaySchedule = (date, appointmentCount) => {
        const scheduleContainer = document.querySelector('.mt-6');
        if (!scheduleContainer) return;
        
        // Format the date
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
        
        // Update the date heading
        const dateHeading = scheduleContainer.querySelector('h4');
        if (dateHeading) {
            dateHeading.textContent = formattedDate;
        }
        
        // Clear existing schedule items
        const scheduleList = scheduleContainer.querySelector('.space-y-2');
        if (scheduleList) {
            if (appointmentCount > 0) {
                // Show a loading message
                scheduleList.innerHTML = '<div class="text-gray-500 text-sm">Loading appointments...</div>';
                
                // Fetch appointments for this day
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                
                // Convert the selected date to YYYY-MM-DD format for database query
                const dateStr = date.toISOString().split('T')[0];
                
                // Get both patient and doctor information
                supabaseClient
                    .from('appointments')
                    .select(`
                        *,
                        patient:patient_id(id, first_name, last_name, email),
                        doctor:doctor_id(id, first_name, last_name, email, department)
                    `)
                    .eq('date', dateStr)
                    .then(({ data, error }) => {
                        if (error) {
                            console.error('Error fetching day appointments:', error);
                            scheduleList.innerHTML = '<div class="text-red-500 text-sm">Error loading appointments</div>';
                            return;
                        }
                        
                        if (data && data.length > 0) {
                            scheduleList.innerHTML = '';
                            
                            data.forEach(appointment => {
                                // Format the time from the time column
                                let formattedTime = appointment.time;
                                if (formattedTime && formattedTime.includes(':')) {
                                    // Convert 24-hour time format to 12-hour format
                                    const timeParts = formattedTime.split(':');
                                    let hours = parseInt(timeParts[0]);
                                    const minutes = timeParts[1];
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12;
                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                    formattedTime = `${hours}:${minutes} ${ampm}`;
                                }
                                
                                // Get patient and doctor information
                                const patient = appointment.patient || {};
                                const doctor = appointment.doctor || {};
                                
                                // Format names and info
                                const patientName = patient && (patient.first_name || patient.last_name) ? 
                                    `${patient.first_name || ''} ${patient.last_name || ''}`.trim() : 
                                    'Unknown Patient';
                                    
                                const doctorName = doctor && (doctor.first_name || doctor.last_name) ? 
                                    `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() : 
                                    'Unknown Doctor';
                                    
                                const department = doctor && doctor.department ? 
                                    doctor.department : 
                                    'General';
                                
                                // Determine color based on appointment status
                                let colorClass = 'blue';
                                if (appointment.status === 'completed') {
                                    colorClass = 'green';
                                } else if (appointment.status === 'cancelled') {
                                    colorClass = 'red';
                                } else if (appointment.status === 'confirmed') {
                                    colorClass = 'purple';
                                }
                                
                                const item = document.createElement('div');
                                item.className = `bg-${colorClass}-50 p-3 rounded-lg border-l-4 border-${colorClass}-500`;
                                item.innerHTML = `
                                    <div class="flex justify-between text-xs text-${colorClass}-700">
                                        <span>${formattedTime}</span>
                                        <span>${appointment.status || 'scheduled'}</span>
                                    </div>
                                    <p class="text-sm font-medium mt-1">${patientName}</p>
                                    <p class="text-xs text-gray-700 mt-1">Doctor: ${doctorName}</p>
                                    <p class="text-xs text-gray-700 mt-1">Department: ${department}</p>
                                    <p class="text-xs text-gray-500 mt-1">${appointment.reason || 'No reason provided'}</p>
                                `;
                                
                                scheduleList.appendChild(item);
                            });
                        } else {
                            scheduleList.innerHTML = '<div class="text-gray-500 text-sm">No appointments scheduled for this day</div>';
                        }
                    });
            } else {
                scheduleList.innerHTML = '<div class="text-gray-500 text-sm">No appointments scheduled for this day</div>';
            }
        }
    };
    
    // Add event listeners for navigation buttons
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            const now = new Date();
            currentMonth = now.getMonth();
            currentYear = now.getFullYear();
            renderCalendar();
        });
    }
    
    // Initial render
    renderCalendar();
};

// Start the dashboard initialization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupLogout();
    // Calendar is already initialized in initDashboard()
});

// Make key functions available globally
window.fetchDashboardStats = fetchDashboardStats;
window.fetchDoctorsData = fetchDoctorsData;
// Use the existing fetchDepartments from admin-supabase-integration.js


// Setup reports tabs functionality
const setupReportsTabs = () => {
    const patientReportBtn = document.getElementById('patient-report-btn');
    const financialReportBtn = document.getElementById('financial-report-btn');
    const appointmentReportBtn = document.getElementById('appointment-report-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');
    
    // Report sections
    const patientReportSection = document.getElementById('patient-report-section');
    const financialReportSection = document.getElementById('financial-report-section');
    const appointmentReportSection = document.getElementById('appointment-report-section');
    
    // Date range selector
    const dateRangeSelector = document.getElementById('report-date-range');
    
    // Function to set active tab
    const setActiveTab = (activeBtn) => {
        [patientReportBtn, financialReportBtn, appointmentReportBtn].forEach(btn => {
            if (btn === activeBtn) {
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                btn.classList.add('bg-blue-600', 'text-white');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });
    };
    
    // Show patient report by default
    if (patientReportBtn) {
        patientReportBtn.addEventListener('click', () => {
            setActiveTab(patientReportBtn);
            patientReportSection.classList.remove('hidden');
            financialReportSection.classList.add('hidden');
            appointmentReportSection.classList.add('hidden');
            fetchPatientReportData();
        });
    }
    
    // Financial report tab
    if (financialReportBtn) {
        financialReportBtn.addEventListener('click', () => {
            setActiveTab(financialReportBtn);
            patientReportSection.classList.add('hidden');
            financialReportSection.classList.remove('hidden');
            appointmentReportSection.classList.add('hidden');
            fetchFinancialReportData();
        });
    }
    
    // Appointment report tab
    if (appointmentReportBtn) {
        appointmentReportBtn.addEventListener('click', () => {
            setActiveTab(appointmentReportBtn);
            patientReportSection.classList.add('hidden');
            financialReportSection.classList.add('hidden');
            appointmentReportSection.classList.remove('hidden');
            fetchAppointmentReportData();
        });
    }
    
    // Generate report button
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.report-section:not(.hidden)');
            if (activeTab.id === 'patient-report-section') {
                fetchPatientReportData();
            } else if (activeTab.id === 'financial-report-section') {
                fetchFinancialReportData();
            } else if (activeTab.id === 'appointment-report-section') {
                fetchAppointmentReportData();
            }
        });
    }
};

// Fetch patient report data
const fetchPatientReportData = async () => {
    const dateRange = document.getElementById('report-date-range').value;
    const days = parseInt(dateRange);
    
    // Get elements to update
    const newPatientsCount = document.getElementById('new-patients-count');
    const genderRatio = document.getElementById('gender-ratio');
    const averageAge = document.getElementById('average-age');
    const recentPatientsTable = document.getElementById('recent-patients-table');
    
    try {
        // Calculate the date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Format dates for Supabase query
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();
        
        // Fetch new patients in the date range
        const { data: newPatients, error: newPatientsError } = await supabaseClient
            .from('profiles')
            .select('id, created_at')
            .eq('role', 'patient')
            .gte('created_at', startDateStr)
            .lte('created_at', endDateStr);
            
        if (newPatientsError) throw newPatientsError;
        
        // Update new patients count
        if (newPatientsCount) {
            newPatientsCount.textContent = newPatients ? newPatients.length : '0';
        }
        
        // Fetch all patients for gender ratio and age calculation
        const { data: allPatients, error: allPatientsError } = await supabaseClient
            .from('profiles')
            .select('id, gender, date_of_birth, created_at, first_name, last_name')
            .eq('role', 'patient');
            
        if (allPatientsError) throw allPatientsError;
        
        if (allPatients && allPatients.length > 0) {
            // Calculate gender ratio
            const males = allPatients.filter(p => p.gender === 'male').length;
            const females = allPatients.filter(p => p.gender === 'female').length;
            const ratio = males && females ? (males / females).toFixed(2) : 'N/A';
            
            if (genderRatio) {
                genderRatio.textContent = ratio === 'N/A' ? ratio : `${ratio}:1`;
            }
            
            // Calculate average age
            const today = new Date();
            let totalAge = 0;
            let patientWithAge = 0;
            
            allPatients.forEach(patient => {
                if (patient.date_of_birth) {
                    const birthDate = new Date(patient.date_of_birth);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    totalAge += age;
                    patientWithAge++;
                }
            });
            
            const avgAge = patientWithAge ? Math.round(totalAge / patientWithAge) : 'N/A';
            if (averageAge) {
                averageAge.textContent = avgAge === 'N/A' ? avgAge : `${avgAge} yrs`;
            }
            
            // Initialize patient age distribution chart
            initPatientAgeDistributionChart(allPatients);
            
            // Update recent patients table
            if (recentPatientsTable) {
                // Sort patients by creation date (newest first)
                const recentPatients = [...allPatients]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 10); // Get the 10 most recent
                
                if (recentPatients.length > 0) {
                    let tableHTML = '';
                    recentPatients.forEach(patient => {
                        const age = patient.date_of_birth 
                            ? today.getFullYear() - new Date(patient.date_of_birth).getFullYear() 
                            : 'N/A';
                        
                        tableHTML += `
                            <tr>
                                <td class="px-4 py-2 text-sm">${patient.first_name} ${patient.last_name}</td>
                                <td class="px-4 py-2 text-sm">${patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}</td>
                                <td class="px-4 py-2 text-sm">${age}</td>
                                <td class="px-4 py-2 text-sm">${new Date(patient.created_at).toLocaleDateString()}</td>
                            </tr>
                        `;
                    });
                    recentPatientsTable.innerHTML = tableHTML;
                } else {
                    recentPatientsTable.innerHTML = `
                        <tr>
                            <td class="px-4 py-2 text-sm text-gray-500" colspan="4">No patients found</td>
                        </tr>
                    `;
                }
            }
        } else {
            // No patients found, show default values
            if (genderRatio) genderRatio.textContent = 'N/A';
            if (averageAge) averageAge.textContent = 'N/A';
            
            if (recentPatientsTable) {
                recentPatientsTable.innerHTML = `
                    <tr>
                        <td class="px-4 py-2 text-sm text-gray-500" colspan="4">No patients found</td>
                    </tr>
                `;
            }
            
            // Initialize chart with empty data
            initPatientAgeDistributionChart([]);
        }
    } catch (error) {
        console.error('Error fetching patient report data:', error);
        
        // Show error state
        if (newPatientsCount) newPatientsCount.textContent = 'Error';
        if (genderRatio) genderRatio.textContent = 'Error';
        if (averageAge) averageAge.textContent = 'Error';
        
        if (recentPatientsTable) {
            recentPatientsTable.innerHTML = `
                <tr>
                    <td class="px-4 py-2 text-sm text-red-500" colspan="4">Error loading patient data</td>
                </tr>
            `;
        }
    }
};
