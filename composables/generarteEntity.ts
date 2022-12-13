export function generateEntity(breed, X, Y) {
  // copy default breed
  const entity = JSON.parse(JSON.stringify(breedStore()[breed]));
  entity.breed = breed;

  generateEntityId(entity);

  let mapOffset = mapStore().mapOffset;
  const animBreed = animStore().breeds[breed];
  const offset = settingsStore().canvasPhysicOffset;
  entity.X = X;
  entity.Y = Y;
  entity.x = entity.X + mapOffset[0];
  entity.y = entity.Y + mapOffset[1];

  entity.state = "idle";
  entity.stateStartFrame = commonStore().gameFrame;
  entity.animState = "idle";
  entity.animStateStartFrame = commonStore().gameFrame;
  entity.mirrored = false;
  entity.health = entity.maxHealth;
  entity.mana = entity.maxMana;
  entityStore().entities.push(entity);
}
