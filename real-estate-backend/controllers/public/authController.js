const db = require('../../models');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For secure session tokens

/**
 * Handles new visitor registration.
 * Maps to the 'user_login' table.
 */
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, contact, address, city, state, zip } = req.body;

        // Hash password before saving to 'user_login' table
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.UserLogin.create({
            Email: email,
            Password: hashedPassword,
            FirstName: firstName,
            LastName: lastName,
            Contact: contact || 'N/A',
            Address: address || 'N/A',
            City: city || 'N/A',
            State: state || 'N/A',
            Zip: zip || '00000',
            Username: email, // Use email as username
            UserType: 'public' // Default role for new visitors
        });

        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Handles visitor login and issues a JWT token.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.UserLogin.findOne({ where: { Email: email } });

        if (!user || !(await bcrypt.compare(password, user.Password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token containing the user's role (UserType)
        const token = jwt.sign(
            { id: user.id, role: user.UserType }, 
            process.env.JWT_SECRET || 'fallback-secret-key-for-testing', 
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, userType: user.UserType });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};