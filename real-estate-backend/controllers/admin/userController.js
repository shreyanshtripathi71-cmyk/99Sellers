const db = require('../../models');
const bcrypt = require('bcryptjs');

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.UserLogin.findAll({
            attributes: { exclude: ['Password'] }, // Exclude password from response
            order: [['id', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await db.UserLogin.findByPk(req.params.id, {
            attributes: { exclude: ['Password'] }
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new user
 */
exports.createUser = async (req, res) => {
    try {
        const {
            FirstName, LastName, Email, Contact,
            Address, City, State, Zip, Username,
            Password, UserType
        } = req.body;

        // Check if user already exists
        const existingUser = await db.UserLogin.findOne({ where: { Email } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await db.UserLogin.create({
            FirstName, LastName, Email, Contact,
            Address, City, State, Zip, Username,
            Password: hashedPassword, UserType
        });

        // Remove password from response
        const userResponse = newUser.toJSON();
        delete userResponse.Password;

        res.status(201).json({
            message: "User created successfully",
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update user
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.Password) {
            const salt = await bcrypt.genSalt(10);
            updateData.Password = await bcrypt.hash(updateData.Password, salt);
        }

        const [updatedRowsCount] = await db.UserLogin.update(updateData, {
            where: { id: id }
        });

        if (updatedRowsCount > 0) {
            const updatedUser = await db.UserLogin.findByPk(id, {
                attributes: { exclude: ['Password'] }
            });
            res.json({
                message: "User updated successfully",
                data: updatedUser
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.UserLogin.destroy({ where: { id: id } });

        if (deleted) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user statistics
 */
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await db.UserLogin.count();
        const adminUsers = await db.UserLogin.count({ where: { UserType: 'Admin' } });
        const regularUsers = await db.UserLogin.count({ where: { UserType: 'public' } });
        
        // Get user registrations by month for the last 12 months
        // Note: This would require adding timestamps to user_login table
        // For now, return basic stats
        
        res.json({
            totalUsers,
            adminUsers,
            regularUsers,
            userTypes: {
                Admin: adminUsers,
                public: regularUsers
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Toggle user status (activate/deactivate)
 */
exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.UserLogin.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Toggle between 'active' and 'inactive' (assuming these are possible UserType values)
        const newStatus = user.UserType === 'inactive' ? 'public' : 'inactive';
        
        await user.update({ UserType: newStatus });

        res.json({
            message: `User ${newStatus === 'inactive' ? 'deactivated' : 'activated'} successfully`,
            data: { id: user.id, status: newStatus }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
