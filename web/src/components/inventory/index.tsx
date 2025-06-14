import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';


const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });


  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper-logo-parent">
          <div className="inventory-wrapper">
            <div className="inventory-wrapper-parent-end">
              <div style={{ width: '180px' }}>
                <div
                  style={{
                    backgroundColor: `rgba(29, 35, 39, 0.77)`,
                    padding: '14px',
                    borderRadius: '2px',
                  }}
                >
                  <InventoryControl />
                </div>
              </div>
              <div style={{ backgroundColor: `rgba(29, 35, 39, 0.77)`, padding: '14px', borderRadius: '2px' }}>
                <LeftInventory />
              </div>
            </div>
            <div className="inventory-wrapper-parent-start">
              
              <div style={{ backgroundColor: `rgba(29, 35, 39, 0.77)`, padding: '14px', borderRadius: '2px' }}>
                <RightInventory />
              </div>
            </div>
            <Tooltip />
            <InventoryContext />
          </div>
          {/* </div> */}
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
