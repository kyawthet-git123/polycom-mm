document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Form submission handling
    const consultationForm = document.getElementById('consultationForm');
    const submitBtn = consultationForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(consultationForm);
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const website = formData.get('website') || '';
        const company = formData.get('company') || '';
        const service = formData.get('service') || '';
        const message = formData.get('message') || '';
        
        // Create email subject
        const subject = encodeURIComponent('New Consultation Request from ' + (firstName + ' ' + lastName).trim());
        
        // Create email body
        let body = 'You have received a new consultation request:\n\n';
        body += 'First Name: ' + firstName + '\n';
        body += 'Last Name: ' + lastName + '\n';
        body += 'Email: ' + email + '\n';
        body += 'Phone: ' + phone + '\n';
        body += 'Website: ' + website + '\n';
        body += 'Company: ' + company + '\n';
        body += 'Service Interested In: ' + service + '\n';
        body += '\nMessage:\n' + message + '\n';
        
        const encodedBody = encodeURIComponent(body);
        
        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.style.opacity = '0.8';
        
        // Open mail client with pre-filled email
        const mailtoLink = 'mailto:info@polycom-mm.com?subject=' + subject + '&body=' + encodedBody;
        
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            // Reset form
            consultationForm.reset();
            
            // Show success message
            alert('Opening your email client. Please send the pre-composed email to complete your consultation request!');
            
            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
            submitBtn.style.opacity = '1';
        }, 2000);
    });
    
    // Form input animations
    const formInputs = consultationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(5px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
    });
    
    // Scroll animations for form
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.form-container, .image-container, .consultation-service-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});