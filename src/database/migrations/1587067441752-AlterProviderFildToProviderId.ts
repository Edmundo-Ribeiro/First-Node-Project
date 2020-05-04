import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFildToProviderId1587067441752
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');

    const newColumn = new TableColumn({
      name: 'provider_id',
      type: 'uuid',
      isNullable: true,
    });
    const foreignKey = new TableForeignKey({
      name: 'AppointmentProvider',
      columnNames: ['provider_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryRunner.addColumn('appointments', newColumn);
    await queryRunner.createForeignKey('appointments', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
    await queryRunner.dropColumn('appointments', 'provider_id');

    const oldColumn = new TableColumn({
      name: 'provider',
      type: 'varchar',
      isNullable: false,
    });
    await queryRunner.addColumn('appointments', oldColumn);
  }
}
