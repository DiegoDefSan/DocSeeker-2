export class RegisterPatient {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dni: string
  ) {}
}