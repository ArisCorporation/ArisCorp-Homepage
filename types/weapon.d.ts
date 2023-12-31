export { IWeapon };

declare global {
  interface IWeapon {
    id: String;
    name: String;
    slug: String;
    storeImage: String;
    price: String;
    manufacturer: Company;
    class: String;
    weight: number;
    calibre: String;
    damageType: String;
    firemodes: String;
    firerateSingle: number;
    firerateBurst: number;
    firerateFullauto: number;
    firerateLoaded: number;
    mag: String;
    optic: IWeaponOptic;
    weaponMuzzleVelocity: number;
    locktime: number;
    description: String;
    maxRange: number;
    effectiveRange: number;
    table: Array;
    owner: IMember;
  }
}
