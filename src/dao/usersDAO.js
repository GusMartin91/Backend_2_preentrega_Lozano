import usersModel from "./models/user.model.js";

class UsersDAO {
    async createUser(userData) {
        try {
            const newUser = await usersModel.create(userData);
            return newUser;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async getUserById(userId) {
        try {
            const user = await usersModel.findById(userId);
            return user;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await usersModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async updateUserById(userId, updateData) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, updateData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async deleteUserById(userId) {
        try {
            await usersModel.findByIdAndDelete(userId);
            return { message: "User successfully deleted" };
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}

export default new UsersDAO();
