/**
 * Represents a restricted command.
 */
export default abstract class RestrictedCommand {

    private requiredPermissions: bigint[] = Array.of();
    private requiredUsers: string[] = Array.of();
    private requiredRoles: string[] = Array.of();

    /**
     * The list of permissions that is required by the user.
     * @returns The required permissions
     */
    public getRequiredPermissions(): bigint[] {
        return this.requiredPermissions;
    }

    /**
     * Set the required permissions the user needs to execute the command.
     * @param permissions List of permissions
     */
    public setRequiredPermissions(...permissions: bigint[]): void {
        this.requiredPermissions = permissions;
    }

    /**
     * The list of user ids that are allowed to execute the command.
     * @returns The list of user ids.
     */
    public getRequiredUsers(): string[] {
        return this.requiredUsers;
    }

    /**
     * Allows a set of users to execute the command.
     * @param users The list of user ids.
     */
    public setRequiredUsers(...users: string[]): void {
        this.requiredUsers = users;
    }

    /**
     * The list of role ids allowed to execute the command.
     * @returns The list of role ids.
     */
    public getRequiredRoles(): string[] {
        return this.requiredRoles;
    }

    /**
     * Allows a set of role ids to execute the command.
     * @param roles The list of role ids.
     */
    public setRequiredRoles(...roles: string[]): void {
        this.requiredRoles = roles;
    }
}